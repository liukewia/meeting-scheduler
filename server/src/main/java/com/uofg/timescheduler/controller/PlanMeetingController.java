package com.uofg.timescheduler.controller;


import static com.uofg.timescheduler.service.constant.TimeConsts.ONE_DAY_MILLIS;
import static com.uofg.timescheduler.service.constant.TimeConsts.ONE_MINUTE_MILLIS;

import cn.hutool.core.map.MapUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.uofg.timescheduler.common.dto.PlanMeetingDto;
import com.uofg.timescheduler.common.dto.SheetsDto;
import com.uofg.timescheduler.common.lang.Result;
import com.uofg.timescheduler.entity.User;
import com.uofg.timescheduler.service.PriorityService;
import com.uofg.timescheduler.service.ScheduleService;
import com.uofg.timescheduler.service.UserService;
import com.uofg.timescheduler.service.ZoneOffsetService;
import com.uofg.timescheduler.service.constant.AlgorithmConsts;
import com.uofg.timescheduler.service.constant.TimeConsts;
import com.uofg.timescheduler.service.internal.Owner;
import com.uofg.timescheduler.service.internal.RatedTimeRange;
import com.uofg.timescheduler.service.internal.SchedulePriority;
import com.uofg.timescheduler.service.internal.SolverByExcelAndReqInput;
import com.uofg.timescheduler.service.internal.TimeRange;
import com.uofg.timescheduler.service.internal.Timetable;
import com.uofg.timescheduler.shiro.AccountProfile;
import com.uofg.timescheduler.util.AlgorithmUtil;
import com.uofg.timescheduler.util.ShiroUtil;
import com.uofg.timescheduler.util.TimeUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@Slf4j
@RequestMapping("/api/meeting")
@Api(tags = "PlanMeetingController")
public class PlanMeetingController {

    @Autowired
    UserService userService;

    @Autowired
    ScheduleService scheduleService;

    @Autowired
    PriorityService priorityService;

    @Autowired ZoneOffsetService zoneOffsetService;

    @RequiresAuthentication
    @PostMapping("/plan")
    @ApiOperation("plan a meeting")
    public Result planMeeting(@RequestBody PlanMeetingDto planMeetingDto, HttpServletResponse response) {
        Integer source = planMeetingDto.getParticipantSource();
        List<Long> participantList = planMeetingDto.getParticipantList();
        List<SheetsDto> spreadsheets = planMeetingDto.getSpreadsheets();
        List<Long> dates = planMeetingDto.getDates();
        Long duration = planMeetingDto.getDuration();
        try {
            List<RatedTimeRange> result;
            if (source == 0) {
                result = planByInternalData(participantList, dates, duration);
            } else if (source == 1) {
                result = planByExternalData(spreadsheets, dates, duration);
            } else {
                throw new IllegalStateException("Unknown participant source.");
            }
            if (result.size() == 0) {
                throw new IllegalStateException("No valid solutions.");
            }
            AccountProfile user = ShiroUtil.getProfile();
            long offset = zoneOffsetService.getUtcOffsetBy(user.getZoneId());
            return Result.succ(MapUtil.builder()
                    .put("result", result.stream().map(slot -> MapUtil.builder()
                            .put("start", slot.getStartTime() + offset)
                            .put("end", slot.getEndTime() + offset)
                            .put("score", slot.getScore()) // if null, is accurate, front end set score to '-'
                            .put("note", slot.getNote())
                            .map())
                            .collect(Collectors.toList()))
                    .map());
        } catch (Exception e) {
            e.printStackTrace();
            return Result.succ(MapUtil.builder()
                    .put("reason", e.getMessage()) // failing
                    .map());
        }
    }

    private List<RatedTimeRange> planByInternalData(List<Long> participantList, List<Long> dates, Long duration) {
        // check dates
        List<TimeRange> datesRequired = dates.stream()
                .sorted(Long::compare)
                .map(dateStartTime -> new TimeRange(dateStartTime, dateStartTime + ONE_DAY_MILLIS))
                .collect(Collectors.toList());
        TimeRange coverage = new TimeRange(datesRequired.get(0).getStartTime(),
                datesRequired.get(datesRequired.size() - 1).getEndTime());

        // check duration
        long durationMillis = duration * TimeConsts.ONE_MINUTE_MILLIS;

        // check people
        if (participantList == null || participantList.size() < 2) {
            throw new IllegalStateException("Please select at least 2 people.");
        }
        int peopleNum = participantList.size();
        List<Timetable> allTimeTables = new ArrayList<>(peopleNum);
        for (Long participantId : participantList) {
            User user = userService.getOne(new QueryWrapper<User>().eq("id", participantId));
            if (user == null) {
                throw new IllegalStateException("Some user does not exist.");
            }
            Owner owner = new Owner();
            Long userId = user.getId();
            owner.setId(userId);
            owner.setName(user.getUsername());
            owner.setZoneOffset(zoneOffsetService.getUtcOffsetBy(user.getZoneId()));
            Timetable timetable = new Timetable();
            timetable.setOwner(owner);
            List<com.uofg.timescheduler.entity.Schedule> schedulesInDB = scheduleService
                    .list(new QueryWrapper<com.uofg.timescheduler.entity.Schedule>()
                            .eq("user_id", userId)
                            .orderByAsc("start_time")
                            .select("id", "title", "start_time", "end_time", "priority_id", "location", "note"));

            List<com.uofg.timescheduler.service.internal.Schedule> schedules = schedulesInDB.stream()
                    .filter(scheduleInDB -> {
                        return datesRequired.stream()
                                .anyMatch(date -> {
                                    return date.hasOverlapWith(scheduleInDB.getStartTime().getTime(),
                                            scheduleInDB.getEndTime().getTime());
                                });
                    })
                    .map(scheduleInDB -> {
                        return new com.uofg.timescheduler.service.internal.Schedule(
                                scheduleInDB.getStartTime().getTime(),
                                scheduleInDB.getEndTime().getTime(),
                                scheduleInDB.getTitle(),
                                SchedulePriority.forId(scheduleInDB.getPriorityId().intValue())
                        );
                    })
                    .collect(Collectors.toList());
            timetable.setScheduleList(Collections.unmodifiableList(schedules));
            timetable.setCoverage(coverage);
            allTimeTables.add(timetable);
        }

        // aggregate all people's schedules in one list in descending order
        List<TimeRange> allTimeRanges = allTimeTables.stream()
                .map(Timetable::getScheduleList)
                .flatMap(Collection::stream)
                .map(com.uofg.timescheduler.service.internal.Schedule::getTimeRange)
                .sorted(Comparator.comparing(TimeRange::getStartTime).reversed())
                .collect(Collectors.toList());

        List<TimeRange> mergedRanges = new ArrayList<>();

        while (allTimeRanges.size() > 0) {
            TimeRange lastUnmergedRange = allTimeRanges.remove(allTimeRanges.size() - 1);
            int size = mergedRanges.size();
            if (size > 0 && mergedRanges.get(size - 1).getEndTime() >= lastUnmergedRange.getStartTime()) {
                mergedRanges.get(size - 1)
                        .setEndTime(Math.max(lastUnmergedRange.getEndTime(),
                                mergedRanges.get(size - 1).getEndTime()));
            } else {
                mergedRanges.add(lastUnmergedRange);
            }
        }

        List<TimeRange> slots = new ArrayList<>();
        if (mergedRanges.size() == 0) {
            slots.add(new TimeRange(TimeConsts.MYSQL_MIN_TIMESTAMP, TimeConsts.MYSQL_MAX_TIMESTAMP));
        } else {
            slots.add(new TimeRange(TimeConsts.MYSQL_MIN_TIMESTAMP, mergedRanges.get(0).getStartTime()));
            for (int i = 0; i < mergedRanges.size() - 1; i++) {
                slots.add(new TimeRange(mergedRanges.get(i).getEndTime(), mergedRanges.get(i + 1).getStartTime()));
            }
            slots.add(
                    new TimeRange(mergedRanges.get(mergedRanges.size() - 1).getEndTime(),
                            TimeConsts.MYSQL_MAX_TIMESTAMP));
        }

        List<TimeRange> slotsInRange = new ArrayList<>();
        for (TimeRange date : datesRequired) {
            for (TimeRange slot : slots) {
                if (slot.getStartTime() >= date.getEndTime()) {
                    break;
                }
                if (date.getStartTime() >= slot.getEndTime()) {
                    continue;
                }
                long lo = Math.max(date.getStartTime(), slot.getStartTime());
                long hi = Math.min(date.getEndTime(), slot.getEndTime());
                if (lo < hi) {
                    slotsInRange.add(new TimeRange(lo, hi));
                }
            }
        }
        slotsInRange = slotsInRange.stream().filter(slot -> slot.getLength() >= durationMillis)
                .collect(Collectors.toList());
        if (slotsInRange.size() > 0) {
            return slotsInRange.stream()
                    .map(i -> i.getPossibleSlotsBy(durationMillis))
                    .flatMap(Collection::stream)
                    .limit(AlgorithmConsts.TOP_OUTPUT_NUM)
                    .map(RatedTimeRange::new)
                    .collect(Collectors.toList());
        }

        // heuristic search
        int currIteration = 0;

        // init
        List<RatedTimeRange> population = new ArrayList<>(AlgorithmConsts.POPULATION_NUM);
        for (int i = 0; i < AlgorithmConsts.POPULATION_NUM; i++) {
            TimeRange randedRange = TimeUtil.generateRandomSlotWithin(datesRequired, durationMillis);
            population.add(new RatedTimeRange(randedRange, allTimeTables));
        }
        // sort by scores in descending order
        population.sort((o1, o2) -> Double.compare(o2.getScore(), o1.getScore()));

        while (currIteration < AlgorithmConsts.ITERATION_TIMES) {
            // crossover
            List<RatedTimeRange> crossover = new ArrayList<>();
            for (int i = 0; i < AlgorithmConsts.CROSSOVER_PROB * AlgorithmConsts.POPULATION_NUM; i++) {
                crossover.addAll(AlgorithmUtil.getSlotAdjacentTo(population.get(i)
                        .getTimeRange())
                        .stream()
                        .map(timeRange -> new RatedTimeRange(timeRange, allTimeTables))
                        .collect(Collectors.toList()));
            }
            population.addAll(crossover);

            // mutation
            List<RatedTimeRange> mutated = new ArrayList<>();
            for (int i = 0; i < AlgorithmConsts.MUTATION_PROB * AlgorithmConsts.POPULATION_NUM; i++) {
                TimeRange randedRange = TimeUtil.generateRandomSlotWithin(datesRequired, durationMillis);
                mutated.add(new RatedTimeRange(randedRange, allTimeTables));
            }
            population.addAll(mutated);

            // sort by descending scores
            population.sort((o1, o2) -> Double.compare(o2.getScore(), o1.getScore()));
            // not deduplicate by hashcode for now
            population = population.subList(0, AlgorithmConsts.POPULATION_NUM);
            // first iteration done, do next iteration and mutate the best n ones to expect a better solution,
            currIteration++;
            // do next iteration
        }

        // ************************* for debug *************************
        Map<RatedTimeRange, Double> debugMap = new HashMap<>();
        for (RatedTimeRange range : population) {
            debugMap.put(range, range.getScore());
        }
        // ************************* for debug *************************

        List<RatedTimeRange> output = new ArrayList<>();
        while (population.size() > 0
                && output.size() <= AlgorithmConsts.TOP_OUTPUT_NUM
        ) {
            RatedTimeRange removed = population.remove(0);
            // deduplicate by hashcode
            if (output.contains(removed)) {
                continue;
            }
            output.add(removed);
        }
        return output.stream()
                .filter(ratedTimeRange -> ratedTimeRange.getScore() >= TimeConsts.PRIORITY_TO_RATING_MAP
                        .get(SchedulePriority.INF))
                .peek(slot -> {
                    List<String> peopleNotAvailable = allTimeTables.stream()
                            .filter(tt -> slot.getTimeRange().hasOverlapWith(tt.getScheduleList()))
                            .map(tt -> tt.getOwner().getName())
                            .collect(Collectors.toList());
                    slot.appendNotes(peopleNotAvailable);
                })
                .limit(AlgorithmConsts.TOP_OUTPUT_NUM)
                .collect(Collectors.toList());
    }

    private List<RatedTimeRange> planByExternalData(List<SheetsDto> spreadsheets, List<Long> dates,
            Long durationInMinute) {
        List<String> inputPaths = spreadsheets.stream()
                .map(SheetsDto::getPath)
                .collect(Collectors.toList());
        List<TimeRange> datesRequired = dates.stream()
                .sorted(Long::compare)
                .map(dateStartTime -> new TimeRange(dateStartTime, dateStartTime + ONE_DAY_MILLIS))
                .collect(Collectors.toList());
        List<RatedTimeRange> intersections = SolverByExcelAndReqInput
                .solve(inputPaths, datesRequired, durationInMinute * ONE_MINUTE_MILLIS);
        return intersections;
    }
}
