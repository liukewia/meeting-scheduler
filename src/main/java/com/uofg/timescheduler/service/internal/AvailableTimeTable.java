package com.uofg.timescheduler.service.internal;


import static com.uofg.timescheduler.constant.TimeConstant.ONE_DAY_MILLIS;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import lombok.Data;

@Data
public class AvailableTimeTable {

    private List<List<TimeRange>> availableTimeList = null;

    public AvailableTimeTable() {
        List<List<TimeRange>> tmpList = new ArrayList<>(7);
        for (int i = 0; i < 7; i++) {
            tmpList.add(new ArrayList<>());
        }
        this.availableTimeList = Collections.unmodifiableList(tmpList);
    }

    public AvailableTimeTable(Timetable t) {
        this();
        findAvailableTimeFromTimetable(t);
    }

    public static AvailableTimeTable constructFromTimetable(Timetable t) {
        AvailableTimeTable att = new AvailableTimeTable();
        att.findAvailableTimeFromTimetable(t);
        return att;
    }

    public static void main(String[] args) {
        System.out.println(new AvailableTimeTable().getAvailableTimeList().size());
    }

    private void findAvailableTimeFromTimetable(Timetable t) {
        List<List<Schedule>> weekList = t.getScheduleList();
        for (int i = 0; i < weekList.size(); i++) {
            long leftGap = 0;
            List<TimeRange> dayAvailableTime = this.availableTimeList.get(i);
            for (Schedule s : weekList.get(i)) {
                long scheduleStart = s.getStartTime();
                if (leftGap < scheduleStart) {
                    dayAvailableTime.add(new TimeRange(leftGap, scheduleStart));
                }
                leftGap = s.getEndTime();
            }
            if (leftGap < ONE_DAY_MILLIS) {
                dayAvailableTime.add(new TimeRange(leftGap, ONE_DAY_MILLIS));
            }
        }
    }

    /**
     * The day in a week starts in Sunday and ends in Saturday.
     *
     * @param index the index represents the day in a week, starting from 0 (Sunday) and ends in 6 (Sat).
     * @return
     */
    public List<TimeRange> getAvailableTimeAtDay(int index) {
        if (index < 0 || index > 6) {
            throw new IllegalArgumentException("The index is not in valid range");
        }
        return this.availableTimeList.get(index);
    }
}
