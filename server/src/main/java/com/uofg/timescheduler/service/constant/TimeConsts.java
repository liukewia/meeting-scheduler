package com.uofg.timescheduler.service.constant;

import com.uofg.timescheduler.service.internal.SchedulePriority;
import java.util.HashMap;
import java.util.Map;

public class TimeConsts {

    public final static long ONE_DAY_MILLIS = 24 * 60 * 60 * 1000L;
    public final static long TWO_DAY_MILLIS = 2 * ONE_DAY_MILLIS;
    public final static long THREE_DAY_MILLIS = 3 * ONE_DAY_MILLIS;
    public final static long FOUR_DAY_MILLIS = 4 * ONE_DAY_MILLIS;
    public final static long FIVE_DAY_MILLIS = 5 * ONE_DAY_MILLIS;
    public final static long SIX_DAY_MILLIS = 6 * ONE_DAY_MILLIS;
    public final static long SEVEN_DAY_MILLIS = 7 * ONE_DAY_MILLIS;

    public final static long ONE_HOUR_MILLIS = 60 * 60 * 1000L;
    public final static long ONE_MINUTE_MILLIS = 60 * 1000L;
    public final static long ONE_SECOND_MILLIS = 1000L;


    public final static int DAYS_IN_A_WEEK = 7;

    public final static int UTC_LOWER_BOUND = -12;
    public final static int UTC_UPPER_BOUND = 14;
    public final static Map<String, Long> DAY_TO_TIMESTAMP_MAP = new HashMap<>();
    public final static Map<Long, String> TIMESTAMP_TO_DAY_MAP = new HashMap<>();
    public final static HashMap<SchedulePriority, Double> PRIORITY_TO_RATING_MAP = new HashMap<>();

    public final static long MYSQL_MIN_TIMESTAMP = -3599000L;
    public final static long MYSQL_MAX_TIMESTAMP = 2147454847000L;

    static {
        DAY_TO_TIMESTAMP_MAP.put("mon", 0L);
        DAY_TO_TIMESTAMP_MAP.put("tues", ONE_DAY_MILLIS);
        DAY_TO_TIMESTAMP_MAP.put("wednes", TWO_DAY_MILLIS);
        DAY_TO_TIMESTAMP_MAP.put("thurs", THREE_DAY_MILLIS);
        DAY_TO_TIMESTAMP_MAP.put("fri", FOUR_DAY_MILLIS);
        DAY_TO_TIMESTAMP_MAP.put("satur", FIVE_DAY_MILLIS);
        DAY_TO_TIMESTAMP_MAP.put("sun", SIX_DAY_MILLIS);

        TIMESTAMP_TO_DAY_MAP.put(0L, "Monday");
        TIMESTAMP_TO_DAY_MAP.put(1L, "Tuesday");
        TIMESTAMP_TO_DAY_MAP.put(2L, "Wednesday");
        TIMESTAMP_TO_DAY_MAP.put(3L, "Thursday");
        TIMESTAMP_TO_DAY_MAP.put(4L, "Friday");
        TIMESTAMP_TO_DAY_MAP.put(5L, "Saturday");
        TIMESTAMP_TO_DAY_MAP.put(6L, "Sunday");

        PRIORITY_TO_RATING_MAP.put(SchedulePriority.NONE, 1.0);
        PRIORITY_TO_RATING_MAP.put(SchedulePriority.LOW, 0.75);
        PRIORITY_TO_RATING_MAP.put(SchedulePriority.NORMAL, 0.5);
        PRIORITY_TO_RATING_MAP.put(SchedulePriority.HIGH, 0.25);
        PRIORITY_TO_RATING_MAP.put(SchedulePriority.INF, AlgorithmConsts.PUNISHMENT_SCORE);
    }

}
