package com.uofg.timescheduler.utils;

import static com.uofg.timescheduler.constant.TimeConstant.ONE_DAY_MILLIS;
import static com.uofg.timescheduler.constant.TimeConstant.ONE_HOUR_MILLIS;
import static com.uofg.timescheduler.constant.TimeConstant.ONE_MINUTE_MILLIS;
import static com.uofg.timescheduler.constant.TimeConstant.UTC_LOWER_BOUND;
import static com.uofg.timescheduler.constant.TimeConstant.UTC_UPPER_BOUND;

import com.uofg.timescheduler.constant.TimeConstant;
import com.uofg.timescheduler.service.internal.Schedule;
import com.uofg.timescheduler.service.internal.TimeRange;
import com.uofg.timescheduler.service.internal.Timetable;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoField;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.math3.exception.OutOfRangeException;

@Log4j2
public class TimeUtil {

    /**
     * time complexity: O(all schedule numbers)
     *
     * @param t
     * @return
     */
    public static List<TimeRange> findAvailableTimeFromTimetable(Timetable t) {
        List<TimeRange> availableTimeList = new ArrayList<>();
        long leftGap = 0;
        for (Schedule s : t.getScheduleList()) {
            long scheduleStart = s.getStartTime();
            if (leftGap < scheduleStart) {
                availableTimeList.add(new TimeRange(leftGap, scheduleStart));
            }
            leftGap = s.getEndTime();
        }
        return availableTimeList;
    }

    public static float parseTimeZone(String value) {
        Pattern p = Pattern.compile("^UTC(?<sign>[+-])(?<num>\\d+)$", Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(value);
        if (!m.matches() || m.groupCount() < 2) {
            throw new IllegalArgumentException("Invalid time zone format with value [ " + value + " ] !");
        }
        float temp = Float.parseFloat(m.group("sign") + m.group("num"));
        if (!TimeUtil.isUTCTimeZoneValid(temp)) {
            throw new OutOfRangeException(temp, UTC_LOWER_BOUND, UTC_UPPER_BOUND);
        }
        return temp;
    }

    /**
     * One can either use SimpleDateFormat class to parse the moment or handle it manually.
     *
     * @param value
     * @return
     * @throws Exception
     */
    public static long parseMoment(String value) throws Exception {
        // expect a legal input to be like "Mon5pm", "Thurs 10(:30) AM", "fri-11.00", "Saturday 11:00"

        // https://zhuanlan.zhihu.com/p/60052611
        Pattern p = Pattern
                .compile(
                        "\\W*(?<day>sun|mon|tues|wednes|thurs|fri|satur)(?:day)?\\D*(?<time>(?<hour>\\d{1,2})\\W*(?<minute>\\d{1,2})?\\W*(?<hourSys>[ap]m)?)");
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
        Long relativeTime = TimeConstant.dayToTimestampMap.get(day);
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
                log.error("Cannot cast the hour [ " + hour + " ] into 24 hour system!");
                throw new OutOfRangeException(hour, 0, 24);
            }
            if (minute < 0 || minute >= 60) {
                log.error("Cannot cast the minute [ " + minute + " ] into 24 hour system!");
                throw new OutOfRangeException(minute, 0, 59);
            }
            relativeTime += hour * ONE_HOUR_MILLIS + minute * ONE_MINUTE_MILLIS;
        } else {
            // the time format is 12 hour system
            // check hour and minute validity
            if (hour < 0 || hour > 12) {
                log.error("Cannot cast the hour [ " + hour + " ] into 12 hour system!");
                throw new OutOfRangeException(hour, 0, 12);
            }
            if (minute < 0 || minute >= 60) {
                log.error("Cannot cast the minute [ " + minute + " ] into 12 hour system!");
                throw new OutOfRangeException(minute, 0, 59);
            }
            // calibrate moments like 12 am, 12 pm.
            if (hour == 12) {
                relativeTime -= ONE_DAY_MILLIS / 2;
            }
            relativeTime += ((hourSys.equals("pm") ? 12 : 0) + hour) * ONE_HOUR_MILLIS + minute * ONE_MINUTE_MILLIS;
        }
        return relativeTime;
    }

    /**
     * expect a legal input to be like "Mon5pm", "Thurs 10(:30) AM", "fri-11.00", "Saturday 11(:00)"
     * Mon5pm -- 86400000+3600000*17 = 147600000
     * Mon5:00pm -- 147600000
     * Thurs 10 AM -- 86400000*4+3600000*10 = 381600000
     * Thurs 10:30 AM -- 86400000*4+3600000*22.5 = 383400000
     * Thurs 10:30 PM -- 86400000*4+3600000*22.5 = 426600000
     * Thurs 10:45 PM -- 86400000*4+3600000*22.75 = 427500000
     * fri-11.00 -- 86400000*5+3600000*11 = 471600000
     * Saturday 11 -- 86400000*6+3600000*11 = 558000000
     **/
    public static void main(String[] args) throws Exception {
//        System.out.println(parseTimeZone("UTC+10"));

        if (parseMoment("Mon5pm") == 147600000
                && parseMoment("Mon5:00pm") == 147600000
                && parseMoment("Thurs 10 AM") == 381600000
                && parseMoment("Thurs 10:30 AM") == 383400000
                && parseMoment("Thurs 10:30 PM") == 426600000
                && parseMoment("Thurs 10:45 PM") == 427500000
                && parseMoment("fri-11.00") == 471600000
                && parseMoment("Saturday 11") == 558000000
        ) {
            System.out.println("---------------------pass---------------------");
        }

//        String input = "Sun 0";
//        System.out.println("input: " + input);
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy E h:mm a");
//        System.out.println(sdf.parse("2001 fri 01:10 pm"));
        long m = parseMoment("fri 01:10 pm");
        System.out.println("startTime= Day " + ((int) m / ONE_DAY_MILLIS + 1) + " @ "
                + (m % ONE_DAY_MILLIS) / ONE_HOUR_MILLIS + ":"
                + (m % ONE_DAY_MILLIS) % ONE_HOUR_MILLIS / 1000 / 60);

//        getStartTimeOfWeek();
    }

    public static List<TimeRange> computeIntersection(List<List<TimeRange>> atts) {

        List<TimeRange> initial = atts.remove(0);
        return atts.stream()
//                .map(AvailableTimeTable::getFlatAvailableTime)
                .reduce(initial, AlgorithmUtil::intervalIntersection);
    }

    public static boolean isUTCTimeZoneValid(Float temp) {
        return temp >= UTC_LOWER_BOUND && temp <= UTC_UPPER_BOUND;
    }

    public static long getStartTimeOfWeek() {
        Instant instant = Instant.now();
        ZoneId zoneId = ZoneId.of("UTC");
        ZonedDateTime zdt = ZonedDateTime.ofInstant(instant, zoneId);
        ZonedDateTime startTimeOfWeek = zdt.with(ChronoField.DAY_OF_WEEK, 1)
                .truncatedTo(ChronoUnit.DAYS);
//        System.out.println(startTimeOfWeek);
        return startTimeOfWeek.toLocalDateTime().toInstant(ZoneOffset.ofHours(0)).toEpochMilli();
    }

    public static boolean isMomentInRange(long moment, TimeRange range) {
        return moment >= range.getStartTime() && moment <= range.getEndTime();
    }

}
