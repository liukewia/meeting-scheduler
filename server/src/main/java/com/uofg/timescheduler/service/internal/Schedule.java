package com.uofg.timescheduler.service.internal;


import lombok.Data;

@Data
public class Schedule {

    private TimeRange timeRange;
    private String name;

    private SchedulePriority priority;

    public Schedule(long startTime, long endTime, String scheduleName, SchedulePriority priority) {
        this.timeRange = new TimeRange(startTime, endTime);
        this.name = scheduleName;
        this.priority = priority;
    }

    public long getStartTime() {
        return this.getTimeRange().getStartTime();
    }

    public long getEndTime() {
        return this.getTimeRange().getEndTime();
    }
}
