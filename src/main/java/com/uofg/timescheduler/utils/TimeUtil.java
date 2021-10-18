package com.uofg.timescheduler.utils;

import static com.uofg.timescheduler.constant.TimeConstant.ONE_DAY_MILLIS;

import com.uofg.timescheduler.service.internal.User;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.math3.exception.OutOfRangeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TimeUtil {

    private static final Logger LOGGER = LoggerFactory.getLogger(User.class);

    public static float normalizeTimeZone(String value) {
        Pattern p = Pattern.compile("^UTC(?<sign>[+-])(?<num>\\d+)$", Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(value);
        if (!m.matches() || m.groupCount() < 2) {
            throw new IllegalArgumentException("Invalid time zone format with value [ " + value + " ] !");
        }
        float temp = Float.parseFloat(m.group("sign") + m.group("num"));
        if (temp < -12 || temp > 14) {
            throw new OutOfRangeException(temp, -12, 14);
        }
        return temp;
    }

    public static long normalizeMoment(String value) throws Exception {
        // expect a legal input to be like "Mon5pm", "Thurs 10(:30) AM", "fri-11.00", "Saturday 11:00"
        Map<String, Long> dayToTimestampMap = new HashMap<>() {
            {
                put("sun", 0L);
                put("mon", ONE_DAY_MILLIS);
                put("tues", 2 * ONE_DAY_MILLIS);
                put("wednes", 3 * ONE_DAY_MILLIS);
                put("thurs", 4 * ONE_DAY_MILLIS);
                put("fri", 5 * ONE_DAY_MILLIS);
                put("satur", 6 * ONE_DAY_MILLIS);
            }
        };
        // https://zhuanlan.zhihu.com/p/60052611
        Pattern p = Pattern
                .compile(
                        "\\W*(?<day>sun|mon|tues|wednes|thurs|fri|satur)(day)?\\D*(?<time>(?<hour>\\d{1,2})\\W*(?<minute>\\d{1,2})?\\W*(?<hourSys>[ap]m)?)");
        Matcher m = p.matcher(value.toLowerCase());
//        System.out.println(m.matches());
        if (!m.matches()) {
            throw new IllegalArgumentException("Invalid moment format with value [ " + value + " ] !");
        }
//        System.out.println("time = '" + m.group("time") + "'");
//        System.out.println("hour = '" + m.group("hour") + "'");
//        System.out.println("minute = '" + m.group("minute") + "'");
//        System.out.println("hourSys = '" + m.group("hourSys") + "'");

        // resolve day
        String day = m.group("day");
        if (day == null) {
            throw new IllegalArgumentException("Cannot recognize the day within [ " + value + " ] !");
        }
        Long relativeTime = dayToTimestampMap.get(day);
        if (relativeTime == null) {
            throw new IllegalArgumentException("Cannot find relative base time by day [ " + day + " ] !");
        }
//        System.out.println("relativeBaseTime = " + relativeTime);

        // resolve hour system
        String hourSys = m.group("hourSys");
//        String time = m.group("time");
        String hourStr = m.group("hour");
        if (hourStr == null) {
            throw new NullPointerException("The hour cannot be null!");
        }
        int hour = Integer.parseInt(hourStr);
        String minuteStr = m.group("minute");
        int minute = 0;
        if (minuteStr != null) {
            minute = Integer.parseInt(minuteStr);
        }
        if (hourSys == null) {
            // the time format is 24 hour system
            // check hour and minute validity
            if (hour < 0 || hour > 24) {
                LOGGER.error("Cannot cast the hour [ " + hour + " ] into 24 hour system!");
                throw new OutOfRangeException(hour, 0, 24);
            }
            if (minute < 0 || minute >= 60) {
                LOGGER.error("Cannot cast the minute [ " + minute + " ] into 24 hour system!");
                throw new OutOfRangeException(minute, 0, 59);
            }
            relativeTime += hour * 60 * 60 * 1000L + minute * 60 * 1000L;
        } else {
            // the time format is 12 hour system
            // check hour and minute validity
            if (hour < 0 || hour > 12) {
                LOGGER.error("Cannot cast the hour [ " + hour + " ] into 12 hour system!");
                throw new OutOfRangeException(hour, 0, 12);
            }
            if (minute < 0 || minute >= 60) {
                LOGGER.error("Cannot cast the minute [ " + minute + " ] into 12 hour system!");
                throw new OutOfRangeException(minute, 0, 59);
            }
            relativeTime += ((hourSys.equals("pm") ? 12 : 0) + hour) * 60 * 60 * 1000L + minute * 60 * 1000L;
        }
        return relativeTime;
    }

    public static void main(String[] args) throws Exception {
//        System.out.println(normalizeTimeZone("UTC+10"));

        if (normalizeMoment("Mon5pm") == 147600000
                && normalizeMoment("Mon5:00pm") == 147600000
                && normalizeMoment("Thurs 10 AM") == 381600000
                && normalizeMoment("Thurs 10:30 AM") == 383400000
                && normalizeMoment("Thurs 10:30 PM") == 426600000
                && normalizeMoment("Thurs 10:45 PM") == 427500000
                && normalizeMoment("fri-11.00") == 471600000
                && normalizeMoment("Saturday 11") == 558000000
        ) {
            System.out.println("---------------------pass---------------------");
        }

        String input = "Sun 0";
        System.out.println("input: " + input);
        System.out.println(normalizeMoment(input));
        // expect a legal input to be like "Mon5pm", "Thurs 10(:30) AM", "fri-11.00", "Saturday 11(:00)"
        // Mon5pm -- 86400000+3600000*17 = 147600000
        // Mon5:00pm -- 147600000
        // Thurs 10 AM -- 86400000*4+3600000*10 = 381600000
        // Thurs 10:30 AM -- 86400000*4+3600000*22.5 = 383400000
        // Thurs 10:30 PM -- 86400000*4+3600000*22.5 = 426600000
        // Thurs 10:45 PM -- 86400000*4+3600000*22.75 = 427500000
        // fri-11.00 -- 86400000*5+3600000*11 = 471600000
        // Saturday 11 -- 86400000*6+3600000*11 = 558000000

    }

}
