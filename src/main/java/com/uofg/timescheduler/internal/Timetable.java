package com.uofg.timescheduler.internal;

public class Timetable {

    // 24 hours in a day are divided into even 96 parts, each represents a time scale of 15 minutes,
    // starting from {index * 15} minutes to {(index + 1) * 15} minutes.
    private String[] sundaySchedules = new String[96];
    private String[] mondaySchedules = new String[96];
    private String[] tuesdaySchedules = new String[96];
    private String[] wednsdaySchedules = new String[96];
    private String[] thursdaySchedules = new String[96];
    private String[] fridaySchedules = new String[96];
    private String[] saturdaySchedules = new String[96];

    private User Owner;

    private int[] preference = null;

    public Timetable() {

    }


}
