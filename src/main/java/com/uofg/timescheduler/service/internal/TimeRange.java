package com.uofg.timescheduler.service.internal;

import static com.uofg.timescheduler.constant.TimeConstant.ONE_DAY_MILLIS;
import static com.uofg.timescheduler.constant.TimeConstant.ONE_HOUR_MILLIS;

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
            throw new IllegalArgumentException("The end time is earlier than the start time!");
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
        return "TimeRange{" +
                "startTime = Day " + ((int) startTime / ONE_DAY_MILLIS + 1) + " @ "
                + (startTime % ONE_DAY_MILLIS) / ONE_HOUR_MILLIS + ":"
                + (startTime % ONE_DAY_MILLIS) % ONE_HOUR_MILLIS / 1000 / 60 +
                "; endTime = Day " + ((int) endTime / ONE_DAY_MILLIS + 1) + " @ "
                + (endTime % ONE_DAY_MILLIS) / ONE_HOUR_MILLIS + ":"
                + (endTime % ONE_DAY_MILLIS) % ONE_HOUR_MILLIS / 1000 / 60 +
                '}';
    }
}
