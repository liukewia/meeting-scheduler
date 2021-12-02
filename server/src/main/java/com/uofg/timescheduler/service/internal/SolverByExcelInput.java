package com.uofg.timescheduler.service.internal;

public class SolverByExcelInput {

//    public static List<TimeRangeEvaluator> solveWithExcelAsInput(ArrayList<String> sheetPaths) {
//        int peopleNum = sheetPaths.size();
//        List<Timetable> tts = new ArrayList<>(peopleNum);
//        List<List<TimeRange>> atts = new ArrayList<>(peopleNum);
//        for (String path : sheetPaths) {
//            Timetable tn = null;
//            try {
//                tn = FileUtil.readTimetableFromExcel(path);
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//            tts.add(tn);
//            Assert.notNull(tn, "The timetable is null!");
//            List<TimeRange> att = TimeUtil.findAvailableTimeFromTimetable(tn);
//            atts.add(att);
//        }
//
//        // calculates intersection. If there is not a meeting time suitable for everyone, try to find a scheme for (n-1)
//        // people, where n is the total number of all people, and not loop this process until n = 2 (there is no
//        // significance to organize a meeting for one single person).
//        int peopleExcluded = 0;
//        List<List<TimeRange>> intersections = new ArrayList<>();
//        do {
//            // choose {peopleExcluded} in {peopleNum} and do all possible combinations
//            List<List<Integer>> combinations = AlgorithmUtil.getSubsetCombination(peopleNum, peopleExcluded);
//            for (List<Integer> combination : combinations) {
//                List<List<TimeRange>> availableTimeTablesToWorkOn = new ArrayList<>();
//                for (int i = 0; i < peopleNum; i++) {
//                    if (!combination.contains(i)) {
//                        availableTimeTablesToWorkOn.add(atts.get(i));
//                    }
//                }
//                intersections.add(TimeUtil.computeIntersection(availableTimeTablesToWorkOn));
//                peopleExcluded++;
//            }
//        } while (intersections.stream().allMatch(List::isEmpty)
//                && peopleNum - peopleExcluded > 1);
//
//        // Output the top {TOP_OUTPUT_NUM} preferred schemes in order from high to low according to the score
//        // if the number of solutions is larger than a given value n, filter the top n ones.
//
//        List<List<Long>> preferences = tts.stream()
//                .map(tt -> tt.getOwner().getPreferences())
//                .collect(Collectors.toList());
//
//        Queue<TimeRangeEvaluator> mostPreferredSlots = TimeRangeEvaluator
//                .getTopPreferredSlots(intersections, preferences, AlgorithmConsts.TOP_OUTPUT_NUM);
//
//        if (peopleExcluded > 1) {
//            // Slots are not convenient for some people, add notes to illustrate this situation.
//            mostPreferredSlots.forEach(e -> {
//                List<String> peopleNotAvailable = tts.stream()
//                        .filter(tt -> e.getTimeRange().hasOverlapWith(tt.getScheduleList()))
//                        .map(tt -> tt.getOwner().getName())
//                        .collect(Collectors.toList());
//                e.appendNotes(peopleNotAvailable);
//            });
//        }
//
//        // debug
////        mostPreferredSlots.forEach(e -> e.appendNotes("   " + e.getRating()));
//        // debug
//
//        List<TimeRangeEvaluator> sortedSlots = new ArrayList<>(mostPreferredSlots);
//        sortedSlots.sort((o1, o2) -> Double.compare(o2.getRating(), o1.getRating()));
//
//        return sortedSlots;
//    }
//
//
//    public static void main(String[] args) {
//        String folderPath = FileUtil.getPath() + File.separator + "inputs";
//        ArrayList<String> sheetPaths = FileUtil.getExcelFilesIn(folderPath);
//        List<TimeRangeEvaluator> trs = solveWithExcelAsInput(sheetPaths);
//        FileUtil.writeResultToExcel(trs);
//    }

}
