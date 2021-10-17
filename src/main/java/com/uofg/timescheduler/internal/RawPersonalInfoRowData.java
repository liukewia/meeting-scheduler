package com.uofg.timescheduler.internal;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Data;

@Data
public class RawPersonalInfoRowData {

    @ExcelProperty(index = 0)
    private String key;
    @ExcelProperty(index = 1)
    private String value;

}
