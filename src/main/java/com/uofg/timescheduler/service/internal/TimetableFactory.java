package com.uofg.timescheduler.service.internal;

import static com.uofg.timescheduler.constant.TimeConstant.DAYS_IN_A_WEEK;
import static com.uofg.timescheduler.constant.TimeConstant.ONE_DAY_MILLIS;
import static com.uofg.timescheduler.constant.TimeConstant.ONE_HOUR_MILLIS;
import static com.uofg.timescheduler.constant.TimeConstant.SEVEN_DAY_MILLIS;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.read.listener.PageReadListener;
import com.alibaba.fastjson.JSON;
import com.uofg.timescheduler.utils.FileUtil;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TimetableFactory {

    private static final Logger LOGGER = LoggerFactory.getLogger(TimetableFactory.class);

    public static Timetable readTimetableFromExcel(String path) {
        Timetable timetable = new Timetable();
//        User user = new User();
        System.out.println("Path of the current input file: " + path);
        EasyExcel.read(path, RawPersonalInfoRowData.class, new PageReadListener<RawPersonalInfoRowData>(dataList -> {
            for (RawPersonalInfoRowData rowData : dataList) {
                LOGGER.info("读取到一条个人数据{}", JSON.toJSONString(rowData));
                timetable.getOwner().updateCorrespondingField(rowData.getKey(), rowData.getValue());
//                LOGGER.info("秒数{}", JSON.toJSONString(rowData.getStartTime()));
            }
        }))
                .sheet(1) // read sheet 2, where saves personal information.
                .headRowNumber(0) // the aligned header is set to be 1 row by default, need to change it to 0.
                .doRead();

        long timeZoneDeviation = Math.round(timetable.getOwner().getUTCTimeZone() * ONE_HOUR_MILLIS);
//        timetable.setOwner(user);

        // handle dynamic vertical headers
        AtomicLong lastStartTime = new AtomicLong();
        AtomicLong currStartTime = new AtomicLong();
        List<List<Schedule>> tmpWeekList = new ArrayList<>(DAYS_IN_A_WEEK);
        for (int i = 0; i < DAYS_IN_A_WEEK; i++) {
            tmpWeekList.add(new ArrayList<>());
        }
        String[] tmpRowData = new String[DAYS_IN_A_WEEK];

        /**
         * there is a time gap in the beginning of the timetable, since the timetable only provides information in
         * one week, the program will treat it as a worst case, i.e., fill it with nonce schedule to prevent possible
         * available time intersection, or say to prevent side effect of jet lag.
         */
        if (timeZoneDeviation > 0) {
            tmpWeekList.get(0).add(new Schedule(0, timeZoneDeviation, "nonce-schedule"));
        }

        EasyExcel.read(path, RawTimetableRowData.class, new PageReadListener<RawTimetableRowData>(dataList -> {
            for (RawTimetableRowData rowData : dataList) {
                // handle data in the previous row
                LocalDateTime currStartDate = rowData.getStartTime();
                currStartTime.set((currStartDate.getHour() * 60 + currStartDate.getMinute()) * 60 * 1000L);
                for (int j = 0; j < DAYS_IN_A_WEEK; j++) {
                    String scheduleName = tmpRowData[j];
                    if (scheduleName != null) {
                        Schedule schedule = new Schedule(
                                lastStartTime.longValue() - timeZoneDeviation,
                                currStartTime.longValue() - timeZoneDeviation,
                                scheduleName);
                        tmpWeekList.get(j).add(schedule);
                    }
                }

                LOGGER.info("读取到一条日程数据{}", JSON.toJSONString(rowData));
                lastStartTime.set(currStartTime.longValue());
                tmpRowData[0] = rowData.getSundaySchedule();
                tmpRowData[1] = rowData.getMondaySchedule();
                tmpRowData[2] = rowData.getTuesdaySchedule();
                tmpRowData[3] = rowData.getWednesdaySchedule();
                tmpRowData[4] = rowData.getThursdaySchedule();
                tmpRowData[5] = rowData.getFridaySchedule();
                tmpRowData[6] = rowData.getSaturdaySchedule();
            }
        }))
                .sheet(0)
                .headRowNumber(1)  // has a default value 1 of number of rows of aligned headers.
                .doRead();

        // handle last row schedule
        currStartTime.set(ONE_DAY_MILLIS);
        for (int j = 0; j < DAYS_IN_A_WEEK; j++) {
            String scheduleName = tmpRowData[j];
            if (scheduleName != null) {
                Schedule schedule = new Schedule(
                        lastStartTime.longValue() - timeZoneDeviation,
                        currStartTime.longValue() - timeZoneDeviation,
                        scheduleName);
                tmpWeekList.get(j).add(schedule);
            }
        }
        if (timeZoneDeviation < 0) {
            tmpWeekList.get(DAYS_IN_A_WEEK - 1)
                    .add(new Schedule(SEVEN_DAY_MILLIS - timeZoneDeviation,
                            SEVEN_DAY_MILLIS,
                            "nonce-schedule"));
        }
//        timetable.setScheduleList(tmpWeekList.stream().reduce(timetable.getScheduleList(), dayList -> {
//            dayList.stream().reduce()
//            return
//        }));

        List<Schedule> flatList = timetable.getScheduleList();
//        for (List<Schedule> dayList : tmpWeekList) {
//            for (Schedule s : dayList) {
//                flatList.add(new Schedule(s.getStartTime()));
//            }
//        }
        for (int i = 0; i < tmpWeekList.size(); i++) {
            List<Schedule> dayList = tmpWeekList.get(i);
            long baseTime = i * ONE_DAY_MILLIS;
            for (Schedule s : dayList) {
                flatList.add(new Schedule(s.getStartTime() + baseTime,
                        s.getEndTime() + baseTime,
                        s.getName()));
            }
        }
        timetable.mergeSegmentedSchedules();
        return timetable;
    }

    public static Timetable generateTemplateWithEmptySchedule() {
        Timetable timetable = new Timetable();
        return null;
    }

    public static Timetable fillRandomData(Timetable timetable) {
        return null;
    }

    public static void writeResultToExcel(Timetable timetable) {

    }

    public static void main(String[] args) {
        TimetableFactory.readTimetableFromExcel(FileUtil.getPath() + "filled-timetable-example.xlsx");
    }

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
}
