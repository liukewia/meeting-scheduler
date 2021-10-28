package com.uofg.timescheduler.service.internal;

import java.util.ArrayList;
import java.util.List;

public class TimetableFactory {

    public static Timetable generateTemplateWithEmptySchedule() {
        Timetable timetable = new Timetable();
        return null;
    }

    public static Timetable fillRandomData(Timetable timetable) {
        return null;
    }


    /**
     * time complexity: O(all schedule numbers)
     *
     * @param t
     * @return
     */
    public static List<TimeRange> findAvailableTimeFromTimetable(Timetable t) {
        List<TimeRange> availableTimeList = new ArrayList<>();
        long leftGap = 0;
        for (Schedule s : t.getScheduleList()) {
            long scheduleStart = s.getStartTime();
            if (leftGap < scheduleStart) {
                availableTimeList.add(new TimeRange(leftGap, scheduleStart));
            }
            leftGap = s.getEndTime();
        }
        return availableTimeList;
    }
}
