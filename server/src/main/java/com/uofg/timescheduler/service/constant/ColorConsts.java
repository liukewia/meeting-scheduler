package com.uofg.timescheduler.service.constant;

import com.uofg.timescheduler.service.internal.SchedulePriority;
import java.util.HashMap;

public final class ColorConsts {

    public final static String LIGHT_GREEN = "FF92D050";
    public final static String ORANGE = "FFFFC000";
    public final static String YELLOW = "FFFFFF00";
    public final static String DARK_RED = "FFC00000";
    public final static HashMap<String, SchedulePriority> COLOR_TO_PRIORITY_MAP = new HashMap<>();

    static {
        COLOR_TO_PRIORITY_MAP.put(LIGHT_GREEN, SchedulePriority.LOW);
        COLOR_TO_PRIORITY_MAP.put(ORANGE, SchedulePriority.NORMAL);
        COLOR_TO_PRIORITY_MAP.put(YELLOW, SchedulePriority.HIGH);
        COLOR_TO_PRIORITY_MAP.put(DARK_RED, SchedulePriority.INF);

    }
}
