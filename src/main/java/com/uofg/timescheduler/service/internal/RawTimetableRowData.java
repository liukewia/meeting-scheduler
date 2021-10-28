package com.uofg.timescheduler.service.internal;

import com.alibaba.excel.annotation.ExcelProperty;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class RawTimetableRowData {

    @ExcelProperty("")
    private LocalDateTime startTime;
    @ExcelProperty("Monday")
    private String mondaySchedule;
    @ExcelProperty("Tuesday")
    private String tuesdaySchedule;
    @ExcelProperty("Wednesday")
    private String wednesdaySchedule;
    @ExcelProperty("Thursday")
    private String thursdaySchedule;
    @ExcelProperty("Friday")
    private String fridaySchedule;
    @ExcelProperty("Saturday")
    private String saturdaySchedule;
    @ExcelProperty("Sunday")
    private String sundaySchedule;
}
