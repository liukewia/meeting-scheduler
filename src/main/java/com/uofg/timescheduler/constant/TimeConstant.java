package com.uofg.timescheduler.constant;

import java.util.HashMap;
import java.util.Map;

public interface TimeConstant {

    long ONE_DAY_MILLIS = 24 * 60 * 60 * 1000L;
    long TWO_DAY_MILLIS = 2 * ONE_DAY_MILLIS;
    long THREE_DAY_MILLIS = 3 * ONE_DAY_MILLIS;
    long FOUR_DAY_MILLIS = 4 * ONE_DAY_MILLIS;
    long FIVE_DAY_MILLIS = 5 * ONE_DAY_MILLIS;
    long SIX_DAY_MILLIS = 6 * ONE_DAY_MILLIS;
    long SEVEN_DAY_MILLIS = 7 * ONE_DAY_MILLIS;

    long ONE_HOUR_MILLIS = 60 * 60 * 1000L;
    long ONE_MINUTE_MILLIS = 60 * 1000L;
    long ONE_SECOND_MILLIS = 1000L;


    int DAYS_IN_A_WEEK = 7;

    int UTC_LOWER_BOUND = -12;
    int UTC_UPPER_BOUND = 14;

    Map<String, Long> dayToTimestampMap = new HashMap<>() {
        {
            put("sun", 0L);
            put("mon", ONE_DAY_MILLIS);
            put("tues", TWO_DAY_MILLIS);
            put("wednes", THREE_DAY_MILLIS);
            put("thurs", FOUR_DAY_MILLIS);
            put("fri", FIVE_DAY_MILLIS);
            put("satur", SIX_DAY_MILLIS);
        }
    };

    Map<Long, String> timestampToDayMap = new HashMap<>() {
        {
            put(0L, "Sunday");
            put(1L, "Monday");
            put(2L, "Tuesday");
            put(3L, "Wednesday");
            put(4L, "Thursday");
            put(5L, "Friday");
            put(6L, "Saturday");
        }
    };
}
