package com.uofg.timescheduler.service.internal;

public class RatedTimeRange {

    private final TimeRange timeRange;
    private double rating = 0.0;
    private String note = "";


    public RatedTimeRange(TimeRange timeRange) {
        this.timeRange = timeRange;
    }
}
