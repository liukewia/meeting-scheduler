package com.uofg.timescheduler.service.internal;

import cn.hutool.crypto.SecureUtil;
import java.text.SimpleDateFormat;
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
        System.out.println(SecureUtil.md5("222222"));
    }

    @Override public String toString() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        java.util.Date startDate = new Date(super.startTime);
        String str1 = sdf.format(startDate);
        java.util.Date endDate = new Date(super.endTime);
        String str2 = sdf.format(endDate);
        return "FreeSlot {" +
                "startdate=" + str1 +
                ", enddate=" + str2 +
                '}';
    }
}
