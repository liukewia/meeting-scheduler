package com.uofg.timescheduler.service.internal;

public enum SchedulePriority {
    INF(10),
    HIGH(3),
    NORMAL(2),
    LOW(1),
    NONE(0);

    private final int value;

    SchedulePriority(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
