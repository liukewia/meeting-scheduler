package com.uofg.timescheduler.service.internal;

import com.uofg.timescheduler.util.AlgorithmUtil;
import com.uofg.timescheduler.util.FileUtil;
import com.uofg.timescheduler.util.TimeUtil;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;
import java.util.stream.Collectors;

public class ProblemSolver {

    public static List<TimeRangeEvaluator> solveWithExcelAsInput(String folderPath, int solutionNum) {
        ArrayList<String> filePaths = FileUtil.getAllFilesIn(folderPath);
        int peopleNum = filePaths.size();
        List<Timetable> tts = new ArrayList<>(peopleNum);
        List<List<TimeRange>> atts = new ArrayList<>(peopleNum);
        for (String path : filePaths) {
            Timetable tn = FileUtil.readTimetableFromExcel(path);
            tts.add(tn);
            List<TimeRange> att = TimeUtil.findAvailableTimeFromTimetable(tn);
            atts.add(att);
        }

        // calculates intersection. If there is not a meeting time suitable for everyone, try to find a scheme for (n-1)
        // people, where n is the total number of all people, and not loop this process until n = 2 (there is no
        // significance to organize a meeting for one single person).
        int peopleExcluded = 0;
        List<List<TimeRange>> intersections = new ArrayList<>();
        do {
            // choose {peopleExcluded} in {peopleNum} and do all possible combinations
            List<List<Integer>> combinations = AlgorithmUtil.getSubsetCombination(peopleNum, peopleExcluded);
            for (List<Integer> combination : combinations) {
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

        // Output the top {solutionNum} preferred schemes in order from high to low according to the score
        // if the number of solutions is larger than a given value n, filter the top n ones.

        List<List<Long>> preferences = tts.stream()
                .map(tt -> tt.getOwner().getPreferences())
                .collect(Collectors.toList());

        Queue<TimeRangeEvaluator> mostPreferredSlots = TimeRangeEvaluator
                .getTopPreferredSlots(intersections, preferences, solutionNum);

        if (peopleExcluded > 1) {
            // Slots are not convenient for some people, add notes to illustrate this situation.
            mostPreferredSlots.forEach(e -> {
                List<String> peopleNotAvailable = tts.stream()
                        .filter(tt -> e.getTimeRange().hasOverlapWith(tt.getScheduleList()))
                        .map(tt -> tt.getOwner().getName())
                        .collect(Collectors.toList());
                e.appendNotes(peopleNotAvailable);
            });
        }

        // debug
//        mostPreferredSlots.forEach(e -> e.appendNotes("   " + e.getRating()));
        // debug

        List<TimeRangeEvaluator> sortedSlots = new ArrayList<>(mostPreferredSlots);
        sortedSlots.sort((o1, o2) -> Double.compare(o2.getRating(), o1.getRating()));

        return sortedSlots;
    }


    public static void main(String[] args) {
        String folderPath = FileUtil.getPath() + File.separator + "inputs";
        List<TimeRangeEvaluator> trs = solveWithExcelAsInput(folderPath, 5);
        FileUtil.writeResultToExcel(trs);
    }

}
