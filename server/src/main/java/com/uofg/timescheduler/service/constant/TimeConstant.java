package com.uofg.timescheduler.service.constant;

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
            put("mon", 0L);
            put("tues", ONE_DAY_MILLIS);
            put("wednes", TWO_DAY_MILLIS);
            put("thurs", THREE_DAY_MILLIS);
            put("fri", FOUR_DAY_MILLIS);
            put("satur", FIVE_DAY_MILLIS);
            put("sun", SIX_DAY_MILLIS);
        }
    };

    Map<Long, String> timestampToDayMap = new HashMap<>() {
        {
            put(0L, "Monday");
            put(1L, "Tuesday");
            put(2L, "Wednesday");
            put(3L, "Thursday");
            put(4L, "Friday");
            put(5L, "Saturday");
            put(6L, "Sunday");
        }
    };
}
