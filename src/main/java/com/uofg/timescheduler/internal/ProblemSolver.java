package com.uofg.timescheduler.internal;

import com.uofg.timescheduler.util.FileUtil;

public class ProblemSolver {

    public static void solveWithExcelAsInput(String... inputPaths) {
        for (String path : inputPaths) {
            Timetable tn = TimetableFactory.readTimetableFromExcel(path);

        }

    }

    public static void main(String[] args) {
        String inputPath = FileUtil.getPath() + "filled-timetable-example.xlsx";
        solveWithExcelAsInput();
    }

}
