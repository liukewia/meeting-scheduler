package com.uofg.timescheduler.service.internal;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import lombok.Data;

@Data
public class TimeRange {

    private long startTime;
    private long endTime;

    /**
     * @param startTime
     * @param endTime
     */
    public TimeRange(long startTime, long endTime) {
        if (endTime < startTime) {
            throw new IllegalStateException("The end time is earlier than the start time!");
        }
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public static void main(String[] args) {
        System.out.println(new TimeRange(0, 64800000));
    }

    /**
     * Utility method: calculate the length of the time span in number.
     */
    public boolean hasOverlapWith(List<Schedule> schedules) {
        return schedules.stream().anyMatch(schedule -> {
            TimeRange that = schedule.getTimeRange();
            return !(this.getEndTime() <= that.getStartTime()
                    || this.getStartTime() >= that.getEndTime());
        });
    }

    public long getLength() {
        return this.endTime - this.startTime;
    }

    @Override public String toString() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        java.util.Date startDate = new Date(startTime);
        String str1 = sdf.format(startDate);
        java.util.Date endDate = new Date(endTime);
        String str2 = sdf.format(endDate);
        return "TimeRange{" +
                "startdate=" + str1 +
                ", enddate=" + str2 +
                '}';
    }
}
