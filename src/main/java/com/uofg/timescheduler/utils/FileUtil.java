package com.uofg.timescheduler.utils;

import static com.uofg.timescheduler.constant.TimeConstant.DAYS_IN_A_WEEK;
import static com.uofg.timescheduler.constant.TimeConstant.ONE_DAY_MILLIS;
import static com.uofg.timescheduler.constant.TimeConstant.ONE_HOUR_MILLIS;
import static com.uofg.timescheduler.constant.TimeConstant.ONE_MINUTE_MILLIS;
import static com.uofg.timescheduler.constant.TimeConstant.SEVEN_DAY_MILLIS;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.read.listener.PageReadListener;
import com.alibaba.fastjson.JSON;
import com.uofg.timescheduler.service.internal.RawPersonalInfoRowData;
import com.uofg.timescheduler.service.internal.RawSolutionRowData;
import com.uofg.timescheduler.service.internal.RawTimetableRowData;
import com.uofg.timescheduler.service.internal.Schedule;
import com.uofg.timescheduler.service.internal.TimeRangeEvaluator;
import com.uofg.timescheduler.service.internal.Timetable;
import com.uofg.timescheduler.service.internal.TimetableFactory;
import com.uofg.timescheduler.service.internal.User;
import java.io.File;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FileUtil {

    private static final Logger LOGGER = LoggerFactory.getLogger(TimetableFactory.class);

    public static ArrayList<String> getAllFilesIn(String folderPath) {
        File folder = new File(folderPath);
        // get the folder list
        File[] files = folder.listFiles();
        ArrayList<String> res = new ArrayList<>();

        for (File file : files) {
            if (file.isFile()) {
                String path = file.getPath();
                if (!path.contains("~$")) {
                    res.add(path);
                }
            } else if (file.isDirectory()) {
                getAllFilesIn(file.getPath());
            }
        }
        return res;
    }

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
                .sheet(1) // read sheet 2, where personal information is saved.
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
        Map<Integer, String> rowDataMap = new HashMap<>();

        /**
         * there is a time gap in the beginning of the timetable, since the timetable only provides information in
         * one week, the program will treat it as a worst case, i.e., fill it with nonce schedule to prevent possible
         * available time intersection, or say to prevent side effect of jet lag.
         */
        if (timeZoneDeviation < 0) {
            tmpWeekList.get(0).add(new Schedule(0, timeZoneDeviation, "nonce-schedule"));
        }

        EasyExcel.read(path, RawTimetableRowData.class, new PageReadListener<RawTimetableRowData>(dataList -> {
            for (RawTimetableRowData rowData : dataList) {
                // handle data in the previous row
                LocalDateTime currStartDate = rowData.getStartTime();
                currStartTime.set((currStartDate.getHour() * 60 + currStartDate.getMinute()) * ONE_MINUTE_MILLIS);
                for (Map.Entry<Integer, String> entry : rowDataMap.entrySet()) {
                    int dayNo = entry.getKey();
                    String scheduleName = entry.getValue();
                    if (scheduleName != null) {
                        Schedule schedule = new Schedule(
                                lastStartTime.longValue() - timeZoneDeviation,
                                currStartTime.longValue() - timeZoneDeviation,
                                scheduleName);
                        tmpWeekList.get(dayNo).add(schedule);
                    }
                }
//                for (int j = 0; j < DAYS_IN_A_WEEK; j++) {
//                    String scheduleName = tmpRowData[j];
//                    if (scheduleName != null) {
//                        Schedule schedule = new Schedule(
//                                lastStartTime.longValue() - timeZoneDeviation,
//                                currStartTime.longValue() - timeZoneDeviation,
//                                scheduleName);
//                        tmpWeekList.get(j).add(schedule);
//                    }
//                }

                LOGGER.info("读取到一条日程数据{}", JSON.toJSONString(rowData));
                lastStartTime.set(currStartTime.longValue());
                rowDataMap.put(0, rowData.getMondaySchedule());
                rowDataMap.put(1, rowData.getTuesdaySchedule());
                rowDataMap.put(2, rowData.getWednesdaySchedule());
                rowDataMap.put(3, rowData.getThursdaySchedule());
                rowDataMap.put(4, rowData.getFridaySchedule());
                rowDataMap.put(5, rowData.getSaturdaySchedule());
                rowDataMap.put(6, rowData.getSundaySchedule());
            }
        }))
                .sheet(0)
                .headRowNumber(1)
                .doRead();

        // handle last row schedule
        currStartTime.set(ONE_DAY_MILLIS);

        for (Map.Entry<Integer, String> entry : rowDataMap.entrySet()) {
            int dayNo = entry.getKey();
            String scheduleName = entry.getValue();
            if (scheduleName != null) {
                Schedule schedule = new Schedule(
                        lastStartTime.longValue() - timeZoneDeviation,
                        currStartTime.longValue() - timeZoneDeviation,
                        scheduleName);
                tmpWeekList.get(dayNo).add(schedule);
            }
        }

        if (timeZoneDeviation > 0) {
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

        // validity check: filter out time preferences that is not in one person's available time.
        User owner = timetable.getOwner();
        owner.setPreferences(owner.getPreferences()
                .stream()
                .filter(p -> timetable.getScheduleList()
                        .stream()
                        .noneMatch(s -> p >= s.getStartTime() && p < s.getEndTime()))
                .collect(Collectors.toList()));
        return timetable;
    }

    // write to new excel
    public static void writeResultToExcel(List<TimeRangeEvaluator> intersections) {
//        String templateFileName = FileUtil.getPath() + File.separator + "output-template.xlsx";
        String outFileName = FileUtil.getPath() + "solution" + ".xlsx";

        EasyExcel.write(outFileName, RawSolutionRowData.class)
                .head(head())
//                .withTemplate(templateFileName)
//                .registerWriteHandler(new LongestMatchColumnWidthStyleStrategy())
                .sheet()
                .doWrite(data(intersections));
    }

    public static InputStream getResourcesFileInputStream(String fileName) {
        return Thread.currentThread().getContextClassLoader().getResourceAsStream("" + fileName);
    }

    public static String getPath() {
        return FileUtil.class.getResource("/").getPath();
    }

    public static File createNewFile(String pathName) {
        File file = new File(getPath() + pathName);
        if (file.exists()) {
            file.delete();
        } else {
            if (!file.getParentFile().exists()) {
                file.getParentFile().mkdirs();
            }
        }
        return file;
    }

    public static File readFile(String pathName) {
        return new File(getPath() + pathName);
    }

    public static File readUserHomeFile(String pathName) {
        return new File(System.getProperty("user.home") + File.separator + pathName);
    }

    public static void main(String[] args) {
        FileUtil.readTimetableFromExcel(FileUtil.getPath() + "filled-timetable-example.xlsx");
    }

    private static List<RawSolutionRowData> data(List<TimeRangeEvaluator> trs) {
        List<RawSolutionRowData> list = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("E HH:mm");
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        long baseTime = TimeUtil.getStartTimeOfWeek();
        for (TimeRangeEvaluator tr : trs) {
            RawSolutionRowData row = new RawSolutionRowData();
            row.setStartTime(sdf.format(baseTime + tr.getTimeRange().getStartTime()));
            row.setEndTime(sdf.format(baseTime + tr.getTimeRange().getEndTime()));
            row.setNote(tr.getNote());
            list.add(row);
        }
        return list;
    }

    private static List<List<String>> head() {
        List<List<String>> list = new ArrayList<List<String>>();
        List<String> head0 = new ArrayList<String>();
        head0.add("Start Time");
        List<String> head1 = new ArrayList<String>();
        head1.add("End Time");
        List<String> head2 = new ArrayList<String>();
        head2.add("Note");
        list.add(head0);
        list.add(head1);
        list.add(head2);
        return list;
    }

}
