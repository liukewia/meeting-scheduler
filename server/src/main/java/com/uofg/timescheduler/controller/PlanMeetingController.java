package com.uofg.timescheduler.controller;


import static com.uofg.timescheduler.service.constant.TimeConsts.ONE_DAY_MILLIS;

import cn.hutool.core.map.MapUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.uofg.timescheduler.common.dto.PlanMeetingDto;
import com.uofg.timescheduler.common.dto.SheetsDto;
import com.uofg.timescheduler.common.lang.Result;
import com.uofg.timescheduler.entity.User;
import com.uofg.timescheduler.service.PriorityService;
import com.uofg.timescheduler.service.ScheduleService;
import com.uofg.timescheduler.service.UserService;
import com.uofg.timescheduler.service.constant.TimeConsts;
import com.uofg.timescheduler.service.internal.Owner;
import com.uofg.timescheduler.service.internal.SchedulePriority;
import com.uofg.timescheduler.service.internal.TimeRange;
import com.uofg.timescheduler.service.internal.Timetable;
import com.uofg.timescheduler.util.ZoneOffsetUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
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
            if (source == 0) {
                List<TimeRange> result = planByInternalData(participantList, dates, duration);
                return Result.succ(MapUtil.builder()
                        .put("result", result.stream().map(slot -> MapUtil.builder()
                                .put("start", slot.getStartTime())
                                .put("end", slot.getEndTime())
                                .map())
                                .collect(Collectors.toList()))
                        .map());
            } else if (source == 1) {
                planByExternalData(spreadsheets, dates, duration);
            } else {
                throw new IllegalStateException("Unknown participant source.");
            }
            return Result.succ(null);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.succ(MapUtil.builder()
                    .put("reason", e.getMessage()) // failing
                    .map());
        }
    }

    private List<TimeRange> planByInternalData(List<Long> participantList, List<Long> dates, Long duration) {
        // check dates
        List<TimeRange> potentialDates = dates.stream()
                .map(dateStartTime -> new TimeRange(dateStartTime, dateStartTime + ONE_DAY_MILLIS))
                .collect(Collectors.toList());

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
            owner.setZoneOffset(ZoneOffsetUtil.getUtcOffsetBy(user.getZoneId()));
            Timetable timetable = new Timetable();
            timetable.setOwner(owner);
            List<com.uofg.timescheduler.entity.Schedule> schedulesInDB = scheduleService
                    .list(new QueryWrapper<com.uofg.timescheduler.entity.Schedule>()
                            .eq("user_id", userId)
                            .orderByAsc("start_time")
                            .select("id", "title", "start_time", "end_time", "priority_id", "location", "note"));

            List<com.uofg.timescheduler.service.internal.Schedule> schedules = schedulesInDB.stream()
                    .filter(scheduleInDB -> {
                        return potentialDates.stream()
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

        System.out.println(1);

        List<TimeRange> slots = new ArrayList<>();
        slots.add(new TimeRange(TimeConsts.MYSQL_MIN_TIMESTAMP, mergedRanges.get(0).getStartTime()));
        for (int i = 0; i < mergedRanges.size() - 1; i++) {
            slots.add(new TimeRange(mergedRanges.get(i).getEndTime(), mergedRanges.get(i + 1).getStartTime()));
        }
        slots.add(
                new TimeRange(mergedRanges.get(mergedRanges.size() - 1).getEndTime(), TimeConsts.MYSQL_MAX_TIMESTAMP));

        List<TimeRange> slotsInRange = new ArrayList<>();
        for (TimeRange date : potentialDates) {
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
        slotsInRange = slotsInRange.stream().filter(slot -> slot.getLength() < durationMillis)
                .collect(Collectors.toList());
        if (slotsInRange.size() > 0) {
            return slotsInRange;
        }

//        slots.add()
//        List<TimeRange> intersections = TimeUtil.computeIntersection(allAvailableTimeTables).stream()
//                .filter(i -> potentialDates.stream().anyMatch(date -> date.contains(i)))
//                .map(i -> i.getPossibleSlotsBy(durationMillis))
//                .flatMap(Collection::stream)
//                .collect(Collectors.toList());
//        if (!intersections.isEmpty()) {
//            return;
//        }

    }

    private void planByExternalData(List<SheetsDto> spreadsheets, List<Long> dates, Long duration) {

    }


}
