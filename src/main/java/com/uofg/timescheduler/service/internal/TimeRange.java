package com.uofg.timescheduler.service.internal;

import static com.uofg.timescheduler.constant.TimeConstant.ONE_DAY_MILLIS;
import static com.uofg.timescheduler.constant.TimeConstant.ONE_HOUR_MILLIS;

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

//    public static long getCurrentWeekStartTime() {
//        Calendar cal = Calendar.getInstance();
//        cal.set(Calendar.HOUR_OF_DAY, 0); // ! clear would not reset the hour of day !
//        cal.clear(Calendar.MINUTE);
//        cal.clear(Calendar.SECOND);
//        cal.clear(Calendar.MILLISECOND);
//
//        // get start of this week in milliseconds
//        cal.set(Calendar.DAY_OF_WEEK, cal.getFirstDayOfWeek());
//        System.out.println("Start of this week:       " + cal.getTime());
//        System.out.println("... in milliseconds:      " + cal.getTimeInMillis());
//        return cal.getTimeInMillis();
//    }
//
//    public static void main(String[] args) {
////        System.out.println(new Timestamp(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000L));
//        System.out.println(getCurrentWeekStartTime());
//    }

//    private boolean isRelativeTime(long time) {
//        return time >= 0 && time <= 604800000;
//    }

    /**
     * Utility method: calculate the length of the time span in number.
     */
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
