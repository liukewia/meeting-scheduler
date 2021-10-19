package com.uofg.timescheduler.service.internal;

import com.uofg.timescheduler.utils.AlgoUtil;
import com.uofg.timescheduler.utils.FileUtil;
import com.uofg.timescheduler.utils.TimeUtil;
import java.util.ArrayList;
import java.util.List;

public class ProblemSolver {

    public static void solveWithExcelAsInput(String... inputPaths) {
        int peopleNum = inputPaths.length;
        List<List<TimeRange>> atts = new ArrayList<>(peopleNum);
        for (String path : inputPaths) {
            Timetable tn = TimetableFactory.readTimetableFromExcel(path);
            List<TimeRange> att = TimetableFactory.findAvailableTimeFromTimetable(tn);
            atts.add(att);
        }
        // calculates intersection. If there is not a meeting time suitable for everyone, try to find a scheme for (n-1)
        // people, where n is the total number of all people, and not loop this process until n = 2 (there is no
        // significance to organize a meeting for one single person).
        int peopleMinus = 0;
        do {
            // choose {peopleMinus} in {peopleNum} and do all possible combinations
            List<List<Integer>> combinations = AlgoUtil.getSubsetCombination(peopleNum, peopleMinus);
            for (List<Integer> combination : combinations) {
//                List<AvailableTimeTable> availableTimeTablesToWorkOn = atts.stream()
//                        .filter(att -> !combination.contains(atts.indexOf(att))).collect(
//                                Collectors.toList());
                List<List<TimeRange>> availableTimeTablesToWorkOn = new ArrayList<>();
                for (int i = 0; i < peopleNum; i++) {
                    if (!combination.contains(i)) {
                        availableTimeTablesToWorkOn.add(atts.get(i));
                    }
                }
                List<TimeRange> intersection = TimeUtil.computeIntersection(availableTimeTablesToWorkOn);
                System.out.println(intersection);
                System.out.println(1);
            }
        } while (peopleNum - peopleMinus > 1);
    }

    public static void main(String[] args) {
        String inputPath1 = FileUtil.getPath() + "t1.xlsx";
        String inputPath2 = FileUtil.getPath() + "t2.xlsx";
        String inputPath3 = FileUtil.getPath() + "t3.xlsx";
        String[] paths = new String[]{inputPath1, inputPath2, inputPath3};
        solveWithExcelAsInput(paths);
    }

}
