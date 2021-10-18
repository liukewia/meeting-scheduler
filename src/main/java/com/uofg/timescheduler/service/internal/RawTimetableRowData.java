package com.uofg.timescheduler.service.internal;

import com.alibaba.excel.annotation.ExcelProperty;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class RawTimetableRowData {

    @ExcelProperty(index = 0)
    private LocalDateTime startTime;
    @ExcelProperty(index = 1)
    private String sundaySchedule;
    @ExcelProperty(index = 2)
    private String mondaySchedule;
    @ExcelProperty(index = 3)
    private String tuesdaySchedule;
    @ExcelProperty(index = 4)
    private String wednesdaySchedule;
    @ExcelProperty(index = 5)
    private String thursdaySchedule;
    @ExcelProperty(index = 6)
    private String fridaySchedule;
    @ExcelProperty(index = 7)
    private String saturdaySchedule;
}
