package com.uofg.timescheduler.service.internal;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.HeadFontStyle;
import com.alibaba.excel.annotation.write.style.HeadStyle;
import com.alibaba.excel.enums.poi.FillPatternTypeEnum;
import lombok.Data;

@Data
@HeadStyle(fillPatternType = FillPatternTypeEnum.SOLID_FOREGROUND, fillForegroundColor = 9)
@HeadFontStyle(fontHeightInPoints = 12, fontName = "Calibri")
public class RawSolutionRowData {

    @ExcelProperty(index = 0)
    private String startTime;
    @ExcelProperty(index = 1)
    private String endTime;
    @ExcelProperty(index = 2)
    private String note;

}
