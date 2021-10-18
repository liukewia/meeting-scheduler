package com.uofg.timescheduler.service.internal;

import com.uofg.timescheduler.utils.FileUtil;
import java.util.ArrayList;
import java.util.List;

public class ProblemSolver {

    public static void solveWithExcelAsInput(String... inputPaths) {
        int peopleNum = inputPaths.length;
        List<AvailableTimeTable> atts = new ArrayList<>(peopleNum);
        for (String path : inputPaths) {
            Timetable tn = TimetableFactory.readTimetableFromExcel(path);
            AvailableTimeTable attn = AvailableTimeTable.constructFromTimetable(tn);
            atts.add(attn);
        }
        // calculates intersection. If there is not a meeting time suitable for everyone, try to find a scheme for (n-1) people, where n is the total number of all people.

        do {

        } while ();
    }

    public static void main(String[] args) {
        String inputPath = FileUtil.getPath() + "t1.xlsx";
        solveWithExcelAsInput(inputPath);
    }

}
