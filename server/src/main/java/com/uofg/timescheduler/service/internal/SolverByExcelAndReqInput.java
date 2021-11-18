package com.uofg.timescheduler.service.internal;

import static com.uofg.timescheduler.service.constant.TimeConsts.ONE_DAY_MILLIS;

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
import java.util.List;
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
        long duration = Integer.parseInt(strs[1]) * TimeConsts.ONE_HOUR_MILLIS;

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
        if (potentialDates.stream().noneMatch(potentialDate -> {
            return allTimeTables.stream().map(Timetable::getCoverage)
                    .allMatch(range -> range.hasOverlapWith(potentialDate));
        })) {
            throw new IllegalStateException("None of the potential meeting dates is convenient for everyone to meet");
        }

        List<List<TimeRange>> allAvailableTimeTables = allTimeTables.stream()
                .map(TimeUtil::findAbsoluteAvailableTimeFromTimetable)
                .collect(Collectors.toList());

        List<TimeRange> intersections = TimeUtil.computeIntersection(allAvailableTimeTables).stream()
                .filter(i -> potentialDates.stream().anyMatch(date -> date.contains(i)))
                .map(i -> i.getPossibleSlotsBy(duration))
                .flatMap(Collection::stream)
                .collect(Collectors.toList());
        if (!intersections.isEmpty()) {
            return intersections;
        }
        // heuristic search
        // find intersection of all coverages
        // define rating  function
        // select top x num ones to output, using heap.
        return null;
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
        solve(folderPath);
    }
}
