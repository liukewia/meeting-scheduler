package com.uofg.timescheduler.service.internal;

import com.uofg.timescheduler.utils.AlgoUtil;
import com.uofg.timescheduler.utils.FileUtil;
import com.uofg.timescheduler.utils.TimeUtil;
import java.util.ArrayList;
import java.util.List;

public class ProblemSolver {

    public static List<TimeRange> solveWithExcelAsInput(String[] inputPaths) {
        int peopleNum = inputPaths.length;
        List<Timetable> tts = new ArrayList<>(peopleNum);
        List<List<TimeRange>> atts = new ArrayList<>(peopleNum);
        for (String path : inputPaths) {
            Timetable tn = FileUtil.readTimetableFromExcel(path);
            tts.add(tn);
            List<TimeRange> att = TimetableFactory.findAvailableTimeFromTimetable(tn);
            atts.add(att);
        }
        // calculates intersection. If there is not a meeting time suitable for everyone, try to find a scheme for (n-1)
        // people, where n is the total number of all people, and not loop this process until n = 2 (there is no
        // significance to organize a meeting for one single person).
        int peopleExcluded = 0;
        List<List<TimeRange>> intersections = new ArrayList<>();
        do {
            // choose {peopleExcluded} in {peopleNum} and do all possible combinations
            List<List<Integer>> combinations = AlgoUtil.getSubsetCombination(peopleNum, peopleExcluded);
            for (List<Integer> combination : combinations) {
//                List<List<TimeRange>> availableTimeTablesToWorkOn = atts.stream()
//                        .filter(att -> !combination.contains(atts.indexOf(att))).collect(
//                                Collectors.toList());
                List<List<TimeRange>> availableTimeTablesToWorkOn = new ArrayList<>();
                for (int i = 0; i < peopleNum; i++) {
                    if (!combination.contains(i)) {
                        availableTimeTablesToWorkOn.add(atts.get(i));
                    }
                }
                intersections.add(TimeUtil.computeIntersection(availableTimeTablesToWorkOn));
                peopleExcluded++;
            }
        } while (intersections.stream().allMatch(List::isEmpty)
                && peopleNum - peopleExcluded > 1);

        System.out.println("Solution:");
        System.out.println(intersections);
        // TODO: Output the top ten schemes in order from high to low according to the score

        // TODO: cant find perfect solutions, need to rate all preferences, get top 10
        // 1. NORMALIZE
        // 2. delete illegal pre

        // TODO: if the number of solutions is larger than a given value n, filter the top n ones.
        return intersections.get(0);
    }


    public static void main(String[] args) {
        String inputPath1 = FileUtil.getPath() + "t1.xlsx";
        String inputPath2 = FileUtil.getPath() + "t2.xlsx";
        String inputPath3 = FileUtil.getPath() + "t3.xlsx";
        String[] paths = new String[]{inputPath1, inputPath2, inputPath3};
        List<TimeRange> trs = solveWithExcelAsInput(paths);
        FileUtil.writeResultToExcel(trs);
    }

}
