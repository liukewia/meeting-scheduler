package com.uofg.timescheduler.internal;


import lombok.Data;

@Data
public class Schedule {

    private TimeRange timeRange;
    private String name;

    public Schedule(long startTime, long endTime, String scheduleName) {
        this.timeRange = new TimeRange(startTime, endTime);
        this.name = scheduleName;
    }

    public long getStartTime() {
        return this.getTimeRange().getStartTime();
    }

    public long getEndTime() {
        return this.getTimeRange().getEndTime();
    }
}
