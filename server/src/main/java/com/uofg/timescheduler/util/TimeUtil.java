package com.uofg.timescheduler.util;

import static com.uofg.timescheduler.service.constant.TimeConsts.ONE_DAY_MILLIS;
import static com.uofg.timescheduler.service.constant.TimeConsts.ONE_HOUR_MILLIS;
import static com.uofg.timescheduler.service.constant.TimeConsts.ONE_MINUTE_MILLIS;
import static com.uofg.timescheduler.service.constant.TimeConsts.UTC_LOWER_BOUND;
import static com.uofg.timescheduler.service.constant.TimeConsts.UTC_UPPER_BOUND;

import com.uofg.timescheduler.service.constant.TimeConsts;
import com.uofg.timescheduler.service.internal.FreeSlot;
import com.uofg.timescheduler.service.internal.Schedule;
import com.uofg.timescheduler.service.internal.SchedulePriority;
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

    public static List<TimeRange> findAbsoluteAvailableTimeFromTimetable(Timetable t) {
        List<TimeRange> availableTimeList = new ArrayList<>();
        long leftGap = t.getCoverage().getStartTime();
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
            throw new IllegalStateException("Invalid time zone format with value [ " + value + " ] !");
        }
        float temp = Float.parseFloat(m.group("sign") + m.group("num"));
        if (!TimeUtil.isUTCTimeZoneValid(temp)) {
            throw new OutOfRangeException(temp, UTC_LOWER_BOUND, UTC_UPPER_BOUND);
        }
        return temp;
    }

    /**
     * One can either use SimpleDateFormat class to parse the moment or handle it manually. However, if using
     * SimpleDateFormat, one have to transform the absolute time that starts from 1/1/1970 to a time in the current
     * week.
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
        if (!m.matches()) {
            throw new IllegalStateException("Invalid moment format with value [ " + value + " ] !");
        }
//        System.out.println("time = '" + m.group("time") + "'");
//        System.out.println("hour = '" + m.group("hour") + "'");
//        System.out.println("minute = '" + m.group("minute") + "'");
//        System.out.println("hourSys = '" + m.group("hourSys") + "'");

        // resolve day
        String day = m.group("day");
        if (day == null) {
            throw new IllegalStateException("Cannot recognize the day within [ " + value + " ] !");
        }
        Long relativeTime = TimeConsts.DAY_TO_TIMESTAMP_MAP.get(day);
        if (relativeTime == null) {
            throw new IllegalStateException("Cannot find relative base time by day [ " + day + " ] !");
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
     * <p>
     * Mon5pm -- 86400000+3600000*17 = 147600000
     * <p>
     * Mon5:00pm -- 147600000
     * <p>
     * Thurs 10 AM -- 86400000*4+3600000*10 = 381600000
     * <p>
     * Thurs 10:30 AM -- 86400000*4+3600000*22.5 = 383400000
     * <p>
     * Thurs 10:30 PM -- 86400000*4+3600000*22.5 = 426600000
     * <p>
     * Thurs 10:45 PM -- 86400000*4+3600000*22.75 = 427500000
     * <p>
     * fri-11.00 -- 86400000*5+3600000*11 = 471600000
     * <p>
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
//        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
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

    public static TimeRange generateRandomSlotWithin(TimeRange coverage, long durationMillis) {
        long totalLength = coverage.getLength();
        long startTime =
                coverage.getStartTime() + Math.round(Math.random() * (totalLength - durationMillis));
        // round each slot to the nearest whole minute
        long remainder = startTime % ONE_MINUTE_MILLIS;
        long roundedStartTime = remainder >= ONE_MINUTE_MILLIS / 2
                ? startTime - remainder + ONE_MINUTE_MILLIS
                : startTime - remainder;
        return new TimeRange(roundedStartTime, roundedStartTime + durationMillis);
    }

    // define rating function
    // find the availability of each participant using binary search, calculating score
    // add up the score to be the total score of that slot.
    public static double rate(TimeRange target, Timetable timetable) {
        long duration = target.getLength();
        // the target has been strictly limited inside the coverage
        // traverse each schedule from the start, and end at the schedule where the start time > target.start time
        if (!timetable.getCoverage().hasOverlapWith(target)) {
            // punishment
            return -Double.MAX_VALUE;
        }
        // here we assume that the schedules has been combined so that no schedules in the timetable has overlap
        // after combination, the calculation's difficulty is reduced
        List<Object> fullList = new ArrayList<>();
        List<Schedule> scheduleList = timetable.getScheduleList();
        fullList.add(new FreeSlot(timetable.getCoverage().getStartTime(), scheduleList.get(0).getStartTime()));
        fullList.add(scheduleList.get(0));
        int i;
        for (i = 1; i < scheduleList.size(); i++) {
            fullList.add(new FreeSlot(scheduleList.get(i - 1).getEndTime(), scheduleList.get(i).getStartTime()));
            fullList.add(scheduleList.get(i));
        }
        fullList.add(new FreeSlot(scheduleList.get(i - 1).getStartTime(), timetable.getCoverage().getEndTime()));

        return fullList.stream()
                .map(slot -> {
                    if (slot.getClass() == FreeSlot.class) {
                        TimeRange overlap = ((FreeSlot) slot).getOverlapWith(target);
                        if (overlap == null) {
                            return 0.0;
                        }
                        return overlap.getLength() / duration * TimeConsts.PRIORITY_TO_RATING_MAP
                                .get(SchedulePriority.NONE);
                    } else {
                        // overlap with a schedule
                        TimeRange overlap = ((Schedule) slot).getTimeRange().getOverlapWith(target);
                        if (overlap == null) {
                            return 0.0;
                        }
                        return overlap.getLength() / duration * TimeConsts.PRIORITY_TO_RATING_MAP
                                .get(((Schedule) slot).getPriority());
                    }
                })
                .reduce(Double::sum).orElse(0.0);
    }

}
