package com.uofg.timescheduler.internal;


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
        reverseTimeRange(t);
    }

    public static void main(String[] args) {
        System.out.println(new AvailableTimeTable().getAvailableTimeList().size());
    }

    private void reverseTimeRange(Timetable t) {
        List<List<Schedule>> weekList = t.getScheduleList();
        for (int i = 0; i < weekList.size(); i++) {
            long leftGap = i * 24 * 60 * 60 * 1000L;
            List<TimeRange> dayAvailableTime = this.availableTimeList.get(i);
            for (Schedule s : weekList.get(i)) {
                long scheduleStart = s.getStartTime();
                if (leftGap < scheduleStart) {
                    dayAvailableTime.add(new TimeRange(leftGap, scheduleStart));
                }
                leftGap = s.getEndTime();
            }
            if (leftGap < (i + 1) * 24 * 60 * 60 * 1000L) {

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
