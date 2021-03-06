package com.uofg.timescheduler.service.internal;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.TimeZone;

public class FreeSlot extends TimeRange {

    /**
     * @param startTime
     * @param endTime
     */
    public FreeSlot(long startTime, long endTime) {
        super(startTime, endTime);
    }

    public static void main(String[] args) {
        System.out.println(LocalDateTime.now());
    }

    @Override public String toString() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        java.util.Date startDate = new Date(super.startTime);
        String str1 = sdf.format(startDate);
        java.util.Date endDate = new Date(super.endTime);
        String str2 = sdf.format(endDate);
        return "FreeSlot {" +
                "startDate=" + str1 +
                ", endDate=" + str2 +
                '}';
    }
}
