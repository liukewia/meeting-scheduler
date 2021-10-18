package com.uofg.timescheduler.service.internal;

import static com.uofg.timescheduler.constant.TimeConstant.ONE_DAY_MILLIS;
import static com.uofg.timescheduler.constant.TimeConstant.ONE_HOUR_MILLIS;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.read.listener.PageReadListener;
import com.alibaba.fastjson.JSON;
import com.uofg.timescheduler.utils.FileUtil;
import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicLong;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TimetableFactory {

    private static final Logger LOGGER = LoggerFactory.getLogger(TimetableFactory.class);

    public static Timetable readTimetableFromExcel(String path) {
        Timetable timetable = new Timetable();
        User user = new User();
        System.out.println(path);
        EasyExcel.read(path, RawPersonalInfoRowData.class, new PageReadListener<RawPersonalInfoRowData>(dataList -> {
            for (RawPersonalInfoRowData rowData : dataList) {
                LOGGER.info("读取到一条个人数据{}", JSON.toJSONString(rowData));
                user.updateCorrespondingField(rowData.getKey(), rowData.getValue());
//                LOGGER.info("秒数{}", JSON.toJSONString(rowData.getStartTime()));
            }
        }))
                .sheet(1) // read sheet 2, where saves personal information.
                .headRowNumber(0) // the aligned header is set to be 1 row by default, need to change it to 0.
                .doRead();

        long deviation = Math.round(user.getUTCTimeZone() * ONE_HOUR_MILLIS);
        timetable.setOwner(user);

        // handle dynamic vertical headers
        AtomicLong lastStartTime = new AtomicLong();
        AtomicLong currStartTime = new AtomicLong();
        String[] tmpSchedules = new String[7];

        EasyExcel.read(path, RawTimetableRowData.class, new PageReadListener<RawTimetableRowData>(dataList -> {
            for (RawTimetableRowData rowData : dataList) {
                // handle data in the last row
                LocalDateTime currStartDate = rowData.getStartTime();
                currStartTime.set((currStartDate.getHour() * 60 + currStartDate.getMinute()) * 60 * 1000L);
                for (int j = 0; j < 7; j++) {
                    String scheduleName = tmpSchedules[j];
                    if (scheduleName != null) {
                        Schedule schedule = new Schedule(
                                lastStartTime.longValue() + deviation,
                                currStartTime.longValue() + deviation,
                                scheduleName);
                        timetable.getScheduleList().get(j).add(schedule);
                    }
                }

                LOGGER.info("读取到一条日程数据{}", JSON.toJSONString(rowData));
                lastStartTime.set(currStartTime.longValue());
                tmpSchedules[0] = rowData.getSundaySchedule();
                tmpSchedules[1] = rowData.getMondaySchedule();
                tmpSchedules[2] = rowData.getTuesdaySchedule();
                tmpSchedules[3] = rowData.getWednesdaySchedule();
                tmpSchedules[4] = rowData.getThursdaySchedule();
                tmpSchedules[5] = rowData.getFridaySchedule();
                tmpSchedules[6] = rowData.getSaturdaySchedule();
            }
        }))
                .sheet(0)
                .headRowNumber(1)  // has a default value 1 of number of rows of aligned headers.
                .doRead();

        // handle last row schedule
        currStartTime.set(ONE_DAY_MILLIS);
        for (int j = 0; j < 7; j++) {
            String scheduleName = tmpSchedules[j];
            if (scheduleName != null) {
                Schedule schedule = new Schedule(
                        lastStartTime.longValue() + deviation,
                        currStartTime.longValue() + deviation,
                        scheduleName);
                timetable.getScheduleList().get(j).add(schedule);
            }
        }

        timetable.mergeSegmentedSchedules();
        return timetable;
    }

    public static AvailableTimeTable computeAvailableTimeTable() {
        return null;
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
}
