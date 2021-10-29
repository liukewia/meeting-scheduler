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
//        long baseTime = getCurrentWeekStartTime();
//        if (isRelativeTime(startTime)) {
//            startTime += baseTime;
//        }
//        if (isRelativeTime(endTime)) {
//            endTime += baseTime;
//        }
        this.startTime = startTime;
        this.endTime = endTime;
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
                "startTime= Day " + ((int) Math.floor(startTime / ONE_DAY_MILLIS) + 1) + " @ "
                + (startTime % ONE_DAY_MILLIS) / ONE_HOUR_MILLIS +
                "; endTime= Day " + ((int) Math.floor(endTime / ONE_DAY_MILLIS) + 1) + " @ "
                + (endTime % ONE_DAY_MILLIS) / ONE_HOUR_MILLIS +
                '}';
    }
}
