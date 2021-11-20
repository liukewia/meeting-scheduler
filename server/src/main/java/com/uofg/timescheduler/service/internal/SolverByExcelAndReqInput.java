package com.uofg.timescheduler.service.internal;

import static com.uofg.timescheduler.service.constant.TimeConsts.ONE_DAY_MILLIS;

import cn.hutool.core.collection.BoundedPriorityQueue;
import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.write.style.column.LongestMatchColumnWidthStyleStrategy;
import com.uofg.timescheduler.service.constant.AlgorithmConsts;
import com.uofg.timescheduler.service.constant.TimeConsts;
import com.uofg.timescheduler.util.FileUtil;
import com.uofg.timescheduler.util.TimeUtil;
import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.TimeZone;
import java.util.stream.Collectors;

public class SolverByExcelAndReqInput {

    public static List<TimeRange> solve(String inputFolderPath) {
        ArrayList<String> sheetPaths = FileUtil.getExcelFilesIn(inputFolderPath);
        // get complete timetables
        int peopleNum = sheetPaths.size();
        List<Timetable> allTimeTables = new ArrayList<>(peopleNum);
        // read potential meeting dates and duration from the requirement file
        String folderPath = FileUtil.getPath() + File.separator + "inputs" + File.separator + "requirement.txt";

        // get potential dates to have the meeting
        String[] strs = FileUtil.readFileAsString(folderPath).split("\n");
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

        for (String path : sheetPaths) {
            Timetable nthTimeTable = null;
            try {
                nthTimeTable = FileUtil.readTimetableFromExcel(path);
            } catch (IOException e) {
                e.printStackTrace();
            }
            allTimeTables.add(nthTimeTable);
        }

        // check that if someone does not provide timetables at all potential dates, since schedule list in a timetable
        // does not reflect the time range coverage
        List<TimeRange> coverages = allTimeTables.stream().map(Timetable::getCoverage).collect(Collectors.toList());
        // due to time zone difference, it is normal to have different time range coverages.
        if (potentialDates.stream().noneMatch(potentialDate -> {
            return coverages.stream().allMatch(range -> range.hasOverlapWith(potentialDate));
        })) {
            throw new IllegalStateException("None of the potential meeting dates is convenient for everyone to meet");
        }

        List<List<TimeRange>> allAvailableTimeTables = allTimeTables.stream()
                .map(TimeUtil::findAbsoluteAvailableTimeFromTimetable)
                .collect(Collectors.toList());

        List<TimeRange> intersections = TimeUtil.computeIntersection(allAvailableTimeTables).stream()
                .filter(i -> potentialDates.stream().anyMatch(date -> date.contains(i)))
                .map(i -> i.getPossibleSlotsBy(durationMillis))
                .flatMap(Collection::stream)
                .collect(Collectors.toList());
        if (!intersections.isEmpty()) {
            return intersections;
        }
        // heuristic search
        // find intersection of all coverages (prerequisite: continuous dates, but not all same dates required)
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

        // generate random population num, each is a slot strictly inside the covIntersect
        // define rating function
        // find the availability of each participant using binary search, calculating score
        // add up the score to be the total score of that slot.
        int iterationNum = 0;
        Queue<TimeRange> population = new BoundedPriorityQueue<>(
                AlgorithmConsts.POPULATION_NUM,
                (e1, e2) -> Double.compare(
                        allTimeTables.stream().map(timetable -> TimeUtil.rate(e2, timetable)).reduce(Double::sum)
                                .orElse(0.0),
                        allTimeTables.stream().map(timetable -> TimeUtil.rate(e1, timetable)).reduce(Double::sum)
                                .orElse(0.0)));

        while (iterationNum++ < AlgorithmConsts.ITERATION_NUM) {
            for (int i = 0; i < AlgorithmConsts.MUTATION_NUM; i++) {
                population.offer(TimeUtil.generateRandomSlotWithin(covIntersect, durationMillis));
            }
        }
        // for debug
        Map<TimeRange, Double> tmpMap = new HashMap<>();
        for (TimeRange range : population) {
            tmpMap.put(range,
                    allTimeTables.stream().map(timetable -> TimeUtil.rate(range, timetable)).reduce(Double::sum)
                            .orElse(0.0));
        }
        // first iteration done, do next iteration and mutate the best n ones to expect a better solution,
        // do all iterations
        // select top x num ones to output, using heap.
        return intersections;
    }


    // write to new excel
    public static void writeResultToExcel(List<TimeRange> intersections) {
        String outFileName = FileUtil.getPath() + "solution" + ".xlsx";

        EasyExcel.write(outFileName, RawSolutionRowData.class)
                .head(head())
//                .withTemplate(templateFileName)
                .registerWriteHandler(new LongestMatchColumnWidthStyleStrategy())
                .sheet()
                .doWrite(data(intersections));
    }

    private static List<RawSolutionRowData> data(List<TimeRange> trs) {
        List<RawSolutionRowData> list = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("E HH:mm");
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        long baseTime = TimeUtil.getStartTimeOfWeek();
        for (TimeRange tr : trs) {
            RawSolutionRowData row = new RawSolutionRowData();
            row.setStartTime(sdf.format(baseTime + tr.getStartTime()));
            row.setEndTime(sdf.format(baseTime + tr.getEndTime()));
            row.setNote(null);
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

//    private static List<List<TimeRange>> getAllTimetablesCoverage(ArrayList<String> sheetPaths) {
//        List<List<TimeRange>> covs = new ArrayList<>();
//        for (String path : sheetPaths) {
//            try {
//                covs.add(FileUtil.readTimetableCoverage(path));
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//        }
//        return covs;
//    }

    public static void main(String[] args) {
        String folderPath = FileUtil.getPath() + File.separator + "inputs";
        List<TimeRange> intersections = solve(folderPath);
//        writeResultToExcel(intersections);
    }
}
