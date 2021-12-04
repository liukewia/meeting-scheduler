package com.uofg.timescheduler.service.internal;

import static com.uofg.timescheduler.service.constant.TimeConsts.ONE_DAY_MILLIS;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.write.style.column.LongestMatchColumnWidthStyleStrategy;
import com.uofg.timescheduler.service.constant.AlgorithmConsts;
import com.uofg.timescheduler.service.constant.TimeConsts;
import com.uofg.timescheduler.util.AlgorithmUtil;
import com.uofg.timescheduler.util.FileUtil;
import com.uofg.timescheduler.util.TimeUtil;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;
import java.util.stream.Collectors;
import lombok.extern.log4j.Log4j2;

@Log4j2
public class SolverByExcelAndReqInput {

    public static List<RatedTimeRange> solve(String inputFolderPath) {
        List<String> sheetPaths = FileUtil.getExcelFilesIn(inputFolderPath);
        String requirementPath = inputFolderPath + "requirement.txt";
        // get potential dates to have the meeting
        String[] strs = FileUtil.readFileAsString(requirementPath).split("\n");
        String[] datesStr = strs[0].split(",");
        long durationMillis = Integer.parseInt(strs[1]) * TimeConsts.ONE_HOUR_MILLIS;

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        sdf.setTimeZone(TimeZone.getTimeZone("UTC")); // the potential dates are already in UTC+0
        List<TimeRange> potentialDates = Arrays.stream(datesStr).map(i -> {
            try {
                long dateStartTime = sdf.parse(i).getTime();
                return new TimeRange(dateStartTime, dateStartTime + ONE_DAY_MILLIS);
            } catch (ParseException e) {
                e.printStackTrace();
                return null;
            }
        }).collect(Collectors.toList());
        return solve(sheetPaths, potentialDates, durationMillis);
    }

    public static List<RatedTimeRange> solve(List<String> sheetPaths, List<TimeRange> potentialDates,
            long durationMillis) {
        // get complete timetables
        int peopleNum = sheetPaths.size();
        List<Timetable> allTimeTables = new ArrayList<>(peopleNum);
        // read potential meeting dates and duration from the requirement file

        for (String path : sheetPaths) {
            Timetable nthTimeTable = null;
            try {
                nthTimeTable = FileUtil.readTimetableFromExcel(path);
            } catch (IOException e) {
                e.printStackTrace();
            }
            allTimeTables.add(nthTimeTable);
        }
        // check repeated ids
        Set<Long> ids = allTimeTables.stream()
                .map(timetable -> timetable.getOwner().getId())
                .collect(Collectors.toSet());

        if (ids.size() < allTimeTables.size()) {
            throw new IllegalStateException(
                    "Some users have the same ids, you may have uploaded a file multiple times.");
        }

        // check that if someone does not provide timetables at all potential dates, since schedule list in a timetable
        // does not reflect the time range coverage
        List<TimeRange> coverages = allTimeTables.stream().map(Timetable::getCoverage).collect(Collectors.toList());
        // due to time zone difference, it is normal to have different time range coverages.
//        if (potentialDates.stream().noneMatch(potentialDate -> {
//            return coverages.stream().allMatch(range -> range.hasOverlapWith(potentialDate));
//        })) {
//            throw new IllegalStateException("None of the potential meeting dates is convenient for everyone to meet");
//        }
        // find intersection of all coverages (prerequisite: continuous dates, but not require all same dates)
        TimeRange covIntersect = coverages.stream().reduce(coverages.remove(0), (prev, curr) -> {
            if (prev == null || curr == null) {
                return null;
            }
            long lower = Math.max(prev.getStartTime(), curr.getStartTime());
            long upper = Math.min(prev.getEndTime(), curr.getEndTime());
            if (lower < upper) {
                return new TimeRange(lower, upper);
            }
            return null;
        });
        if (covIntersect == null) {
            throw new IllegalStateException("All users' timetable coverages produce no intersection.");
        }

        List<TimeRange> datesRequired = covIntersect.getOverlapsWith(potentialDates)
                .stream()
                .filter(i -> i.getLength() >= durationMillis)
                .collect(Collectors.toList());
        if (datesRequired.size() == 0) {
            throw new IllegalStateException(
                    "There are no coverage intersections falling into the required meeting dates.");
        }
        List<List<TimeRange>> allAvailableTimeTables = allTimeTables.stream()
                .map(TimeUtil::findAbsoluteAvailableTimeFromTimetable)
                .collect(Collectors.toList());

        List<TimeRange> intersections = TimeUtil.computeIntersection(allAvailableTimeTables).stream()
                .filter(i -> potentialDates.stream().anyMatch(date -> date.contains(i)))
                .map(i -> i.getPossibleSlotsBy(durationMillis))
                .flatMap(Collection::stream)
                .limit(AlgorithmConsts.TOP_OUTPUT_NUM)
                .collect(Collectors.toList());
        if (!intersections.isEmpty()) {
            return intersections.stream()
                    .map(RatedTimeRange::new)
                    .collect(Collectors.toList());
        }
        // heuristic search

        // generate random population num, each is a slot strictly inside the covIntersect
        // define rating function
        // find the availability of each participant using binary search, calculating score
        // add up the score to be the total score of that slot.
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
//                .map(RatedTimeRange::getTimeRange)
                // Slots are not convenient for some people, add notes to illustrate this situation.
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


    // write to new excel
    public static void writeResultToExcel(List<RatedTimeRange> intersections) {
        String outFileName = FileUtil.getPath() + "solution" + ".xlsx";

        EasyExcel.write(outFileName, RawSolutionRowData.class)
                .head(head())
//                .withTemplate(templateFileName)
                .registerWriteHandler(new LongestMatchColumnWidthStyleStrategy())
                .sheet()
                .doWrite(data(intersections));
    }

    private static List<RawSolutionRowData> data(List<RatedTimeRange> trs) {
        List<RawSolutionRowData> list = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("E HH:mm");
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        long baseTime = TimeUtil.getStartTimeOfWeek();
        for (RatedTimeRange tr : trs) {
            RawSolutionRowData row = new RawSolutionRowData();
            row.setStartTime(sdf.format(baseTime + tr.getStartTime()));
            row.setEndTime(sdf.format(baseTime + tr.getEndTime()));
            row.setNote(tr.getNote());
            list.add(row);
        }
        return list;
    }

    private static List<List<String>> head() {
        List<List<String>> list = new ArrayList<List<String>>();
        List<String> head0 = new ArrayList<String>();
        head0.add("Start Time (UTC+0)");
        List<String> head1 = new ArrayList<String>();
        head1.add("End Time (UTC+0)");
        List<String> head2 = new ArrayList<String>();
        head2.add("Note");
        list.add(head0);
        list.add(head1);
        list.add(head2);
        return list;
    }

    public static void main(String[] args) {
        String folderPath = FileUtil.getPath() + "inputs";
        List<RatedTimeRange> intersections = solve(folderPath);
        writeResultToExcel(intersections);
    }
}
