package com.uofg.timescheduler.service.constant;

import com.uofg.timescheduler.service.internal.SchedulePriority;
import java.util.HashMap;

public class ColorConsts {

    public static String LIGHT_GREEN = "FF92D050";
    public static String ORANGE = "FFFFC000";
    public static String YELLOW = "FFFFFF00";
    public static HashMap<String, SchedulePriority> COLOR_TO_PRIORITY_MAP;

    static {
        COLOR_TO_PRIORITY_MAP = new HashMap<>();
        COLOR_TO_PRIORITY_MAP.put(LIGHT_GREEN, SchedulePriority.LOW);
        COLOR_TO_PRIORITY_MAP.put(ORANGE, SchedulePriority.NORMAL);
        COLOR_TO_PRIORITY_MAP.put(YELLOW, SchedulePriority.HIGH);
    }
}
