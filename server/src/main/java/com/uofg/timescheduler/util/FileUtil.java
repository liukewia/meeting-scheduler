package com.uofg.timescheduler.util;

import static com.uofg.timescheduler.service.constant.TimeConsts.DAYS_IN_A_WEEK;
import static com.uofg.timescheduler.service.constant.TimeConsts.ONE_DAY_MILLIS;
import static com.uofg.timescheduler.service.constant.TimeConsts.ONE_HOUR_MILLIS;
import static com.uofg.timescheduler.service.constant.TimeConsts.SEVEN_DAY_MILLIS;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.write.style.column.LongestMatchColumnWidthStyleStrategy;
import com.uofg.timescheduler.service.constant.ColorConsts;
import com.uofg.timescheduler.service.internal.RawSolutionRowData;
import com.uofg.timescheduler.service.internal.Schedule;
import com.uofg.timescheduler.service.internal.SchedulePriority;
import com.uofg.timescheduler.service.internal.TimeRangeEvaluator;
import com.uofg.timescheduler.service.internal.Timetable;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.TimeZone;
import java.util.TreeSet;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;


@Slf4j
public class FileUtil {

    public static ArrayList<String> getAllFilesIn(String folderPath) {
        File folder = new File(folderPath);
        // get the folder list
        File[] files = folder.listFiles();
        ArrayList<String> res = new ArrayList<>();

        for (File file : files) {
            if (file.isFile()) {
                String path = file.getPath();
                if (!path.contains("~$")) {
                    // is temporary file
                    res.add(path);
                }
            } else if (file.isDirectory()) {
                getAllFilesIn(file.getPath());
            }
        }
        // debug
        res.sort(String::compareTo);
        // debug

        return res;
    }

    public static Timetable readTimetableFromExcel(String path) throws IOException {
        Timetable timetable = new Timetable();

        // read sheet 2 first
        FileInputStream fs = new FileInputStream(path);
        XSSFWorkbook book = new XSSFWorkbook(fs);
        XSSFSheet sheet2 = book.getSheetAt(1);

        for (int i = 0; i < 3; i++) {
            Row rowData = sheet2.getRow(i);
            if (rowData == null) {
                throw new IllegalStateException("Row " + rowData + "in sheet 2 is null.");
            }
            Cell key = rowData.getCell(0);
            Cell value = rowData.getCell(1);
            if (key == null) {
                throw new IllegalStateException("The value in row " + rowData + ", column 1 in sheet 2 is null.");
            }
            if (value == null) {
                throw new IllegalStateException("The value in row " + rowData + ", column 2 in sheet 2 is null.");
            }
            timetable.getOwner().updateCorrespondingField(key, value);
        }

//        EasyExcel.read(path, RawPersonalInfoRowData.class, new PageReadListener<RawPersonalInfoRowData>(dataList -> {
//            for (RawPersonalInfoRowData rowData : dataList) {
//                log.info("Read personal info data in this row: {}", JSON.toJSONString(rowData));
//                timetable.getOwner().updateCorrespondingField(rowData.getKey(), rowData.getValue());
////                log.info("秒数{}", JSON.toJSONString(rowData.getStartTime()));
//            }
//        }))
//                .sheet(1) // read sheet 2, where personal information is saved.
//                .headRowNumber(0) // the aligned header is set to be 1 row by default, need to change it to 0.
//                .doRead();
        // read sheet 1
        XSSFSheet sheet1 = book.getSheetAt(0);
        Row firstRow = sheet1.getRow(0);
        int numberOfCells = firstRow.getPhysicalNumberOfCells();
        List<Date> alignedHeader = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        Set<Date> setToCheckRepeat = new TreeSet<>((o1, o2) -> (int) (o1.getTime() - o2.getTime()));
        // rows can be discrete
        for (int i = 1; i < numberOfCells + 1; i++) {
            try {
                Date d = sdf.parse(firstRow.getCell(i).getStringCellValue());
                alignedHeader.add(d);
                setToCheckRepeat.add(d);
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        // aligned header validity check
        if (alignedHeader.size() > setToCheckRepeat.size()) {
            throw new IllegalStateException("The aligned header in sheet 1 has repeated dates, which is not allowed");
        }
        int rows = sheet1.getPhysicalNumberOfRows();
        // collect vertical header
        List<Long> verticalHeader = new ArrayList<>();

        for (int i = 1; i < rows; i++) {
            double startTime = sheet1.getRow(i).getCell(0).getNumericCellValue();
            long startTimeInLong = Math.round(startTime * ONE_DAY_MILLIS / 10) * 10;
            if (!verticalHeader.isEmpty() && startTimeInLong <= verticalHeader.get(verticalHeader.size() - 1)) {
                throw new IllegalStateException("The vertical header in sheet 1 has backward moment.");
            }
            verticalHeader.add(startTimeInLong);
        }

        long timeZoneDeviation = Math.round(timetable.getOwner().getUTCTimeZone() * ONE_HOUR_MILLIS);

//        AtomicLong lastStartTime = new AtomicLong();
//        AtomicLong currStartTime = new AtomicLong();
        List<List<Schedule>> tmpWeekList = new ArrayList<>(DAYS_IN_A_WEEK);
        for (int i = 0; i < DAYS_IN_A_WEEK; i++) {
            tmpWeekList.add(new ArrayList<>());
        }
//        Map<Integer, String> rowDataMap = new HashMap<>();

        /**
         * there is a time gap in the beginning of the timetable, since the timetable only provides information in
         * one week, the program will treat it as a worst case, i.e., fill it with nonce schedule to prevent possible
         * available time intersection, or say to prevent side effect of jet lag.
         */
        if (timeZoneDeviation < 0) {
            tmpWeekList.get(0).add(new Schedule(timeZoneDeviation, 0, "nonce-for-early-timezone",
                    SchedulePriority.MAX));
        }

        int cols = sheet1.getRow(0).getPhysicalNumberOfCells() + 1; // 8
        // collect schedules per day
        for (int i = 1; i < cols; i++) {
            for (int j = 1; j < rows; j++) {
                Cell cell = sheet1.getRow(j).getCell(i);
                if (cell == null) {
                    continue;
                }
                // get schedule name
                String name = cell.getStringCellValue();
                long startTime = verticalHeader.get(j - 1);
                long endTime = verticalHeader.size() > j ? verticalHeader.get(j) : ONE_DAY_MILLIS;
                short pat = cell.getCellStyle().getFillPattern().getCode(); // 0 - no fill, 1 - SOLID_FOREGROUND
                if (pat != FillPatternType.SOLID_FOREGROUND.getCode()) {
                    throw new IllegalStateException(
                            "The schedule at row " + (j + 1) + ", column " + (i + 1) + "is not colored.");
                }
                XSSFColor color = (XSSFColor) cell.getCellStyle().getFillForegroundColorColor();
                SchedulePriority p = ColorConsts.COLOR_TO_PRIORITY_MAP.get(color.getARGBHex());
                if (p == null) {
                    throw new IllegalStateException(
                            "Cannot find proper priority for schedule at row " + (j + 1) + ", column " + (i + 1) + ".");
                }
                tmpWeekList.get(i - 1).add(new Schedule(startTime, endTime, name, p));
            }
        }

//        EasyExcel.read(path, RawTimetableRowData.class, new PageReadListener<RawTimetableRowData>(dataList -> {
//            for (RawTimetableRowData rowData : dataList) {
//                // handle data in the previous row
//                LocalDateTime currStartDate = rowData.getStartTime();
//                currStartTime.set((currStartDate.getHour() * 60 + currStartDate.getMinute()) * ONE_MINUTE_MILLIS);
//                for (Entry<Integer, String> entry : rowDataMap.entrySet()) {
//                    int dayNo = entry.getKey();
//                    String scheduleName = entry.getValue();
//                    if (scheduleName != null) {
//                        Schedule schedule = new Schedule(
//                                lastStartTime.longValue() - timeZoneDeviation,
//                                currStartTime.longValue() - timeZoneDeviation,
//                                scheduleName);
//                        tmpWeekList.get(dayNo).add(schedule);
//                    }
//                }
//
//                log.info("Read schedule data in this row: {}", JSON.toJSONString(rowData));
//                lastStartTime.set(currStartTime.longValue());
//                rowDataMap.put(0, rowData.getMondaySchedule());
//                rowDataMap.put(1, rowData.getTuesdaySchedule());
//                rowDataMap.put(2, rowData.getWednesdaySchedule());
//                rowDataMap.put(3, rowData.getThursdaySchedule());
//                rowDataMap.put(4, rowData.getFridaySchedule());
//                rowDataMap.put(5, rowData.getSaturdaySchedule());
//                rowDataMap.put(6, rowData.getSundaySchedule());
//            }
//        }))
//                .sheet(0)
//                .headRowNumber(1)
//                .doRead();
//
//        // handle last row schedule
//        currStartTime.set(ONE_DAY_MILLIS);
//
//        for (Entry<Integer, String> entry : rowDataMap.entrySet()) {
//            int dayNo = entry.getKey();
//            String scheduleName = entry.getValue();
//            if (scheduleName != null) {
//                Schedule schedule = new Schedule(
//                        lastStartTime.longValue() - timeZoneDeviation,
//                        currStartTime.longValue() - timeZoneDeviation,
//                        scheduleName);
//                tmpWeekList.get(dayNo).add(schedule);
//            }
//        }

        if (timeZoneDeviation > 0) {
            tmpWeekList.get(DAYS_IN_A_WEEK - 1)
                    .add(new Schedule(SEVEN_DAY_MILLIS - timeZoneDeviation,
                            SEVEN_DAY_MILLIS,
                            "nonce-for-late-timezone", SchedulePriority.MAX));
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
            long baseTime = alignedHeader.get(i).getTime();
            for (Schedule s : dayList) {
                flatList.add(new Schedule(s.getStartTime() + baseTime,
                        s.getEndTime() + baseTime,
                        s.getName(), s.getPriority()));
            }
        }
        timetable.mergeSegmentedSchedules();
//
//        // validity check: filter out time preferences that is not in one person's available time.
//        User owner = timetable.getOwner();
//        owner.setPreferences(owner.getPreferences()
//                .stream()
//                .filter(p -> timetable.getScheduleList()
//                        .stream()
//                        .noneMatch(s -> p >= s.getStartTime() && p < s.getEndTime()))
//                .collect(Collectors.toList()));
        return timetable;
    }

    // write to new excel
    public static void writeResultToExcel(List<TimeRangeEvaluator> intersections) {
        String outFileName = FileUtil.getPath() + "solution" + ".xlsx";

        EasyExcel.write(outFileName, RawSolutionRowData.class)
                .head(head())
//                .withTemplate(templateFileName)
                .registerWriteHandler(new LongestMatchColumnWidthStyleStrategy())
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

    public static void main(String[] args) throws ParseException {
//        try {
//            FileUtil.readTimetableFromExcel(FileUtil.getPath() + "filled-timetable-example.xlsx");
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

        Set<Date> set = new TreeSet<>((o1, o2) -> (int) (o1.getTime() - o2.getTime()));
        set.add(sdf.parse("11/11/2021"));
        set.add(sdf.parse("12/11/2021"));
        set.add(sdf.parse("11/11/2021"));
        System.out.println(set);
    }

    private static boolean isDatesInAscendingOrder(List<Date> list) {
        for (int i = 1; i < list.size() - 1; i++) {
            if (list.get(i - 1).getTime() <= list.get(i).getTime()) {
                return false;
            }
        }
        return true;
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
        head0.add("Start Time (UTC+0)");
        List<String> head1 = new ArrayList<String>();
        head1.add("End Time (UTC+0)");
        List<String> head2 = new ArrayList<String>();
        head2.add("Note");
        list.add(head0);
        list.add(head1);
        list.add(head2);
        return list;
    }

}
