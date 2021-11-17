package com.uofg.timescheduler.service.internal;

public enum SchedulePriority {
    MAX(Integer.MAX_VALUE / 2),
    HIGH(3),
    NORMAL(2),
    LOW(1),
    MIN(0);

    private final int value;

    SchedulePriority(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}