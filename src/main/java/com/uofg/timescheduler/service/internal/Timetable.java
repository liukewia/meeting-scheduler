package com.uofg.timescheduler.service.internal;

import static com.uofg.timescheduler.constant.TimeConstant.DAYS_IN_A_WEEK;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import lombok.Data;

@Data
public class Timetable {

    // 24 hours in a day are divided into even 96 parts, each represents a time scale of 15 minutes,
    // starting from {index * 15} minutes to {(index + 1) * 15} minutes.
//    private String[] sundaySchedules = new String[96];
//    private String[] mondaySchedules = new String[96];
//    private String[] tuesdaySchedules = new String[96];
//    private String[] wednesdaySchedules = new String[96];
//    private String[] thursdaySchedules = new String[96];
//    private String[] fridaySchedules = new String[96];
//    private String[] saturdaySchedules = new String[96];

    private List<List<Schedule>> scheduleList = null;
    private User owner;

    public Timetable() {
        List<List<Schedule>> tmpList = new ArrayList<>(DAYS_IN_A_WEEK);
        for (int i = 0; i < 7; i++) {
            tmpList.add(new ArrayList<>());
        }
        this.scheduleList = Collections.unmodifiableList(tmpList);
    }

    public static void main(String[] args) {
//        List<List<String>> a = new ArrayList<>(7);
//        a.add(new ArrayList<>());
//        a.get(0).add("1");
//        List<List<String>> unmodifiable = Collections.unmodifiableList(a);
//        unmodifiable.set(0, new ArrayList<>());
//        System.out.println(unmodifiable.get(1));
    }

    public void mergeSegmentedSchedules() {

        List<List<Schedule>> newList = new ArrayList<>(DAYS_IN_A_WEEK);
        for (List<Schedule> oldSubList : this.scheduleList) {
            List<Schedule> newSubList = new ArrayList<>();
            int formerSize = oldSubList.size();
            int slow = 0;
            int fast = 0;
            while (fast < formerSize - 1) {
                Schedule curr = oldSubList.get(slow);
                Schedule next = oldSubList.get(fast + 1);

                while (next != null
                        && curr.getEndTime() == next.getStartTime()
                        && curr.getName().equals(next.getName())) {
                    fast++;
                    curr = oldSubList.get(fast);
                    next = fast + 1 < formerSize ? oldSubList.get(fast + 1) : null;
                }

                Schedule prev = oldSubList.get(slow);
                if (slow == fast) {
                    newSubList.add(prev);
                } else {
                    Schedule merged = new Schedule(prev.getStartTime(),
                            curr.getEndTime(),
                            curr.getName());

                    newSubList.add(merged);
                }
                slow = ++fast;
            }
            newSubList.addAll(oldSubList.subList(slow, oldSubList.size()));
            newList.add(newSubList);
        }

        this.scheduleList = Collections.unmodifiableList(newList);
    }


}

//    public void mergeSegmentedSchedules() {
//
//        List<List<Schedule>> newList = new ArrayList<>(7);
//        for (List<Schedule> dailySchedules : this.scheduleList) {
//            List<Schedule> subList = new LinkedList<>();
//            int formerSize = dailySchedules.size();
//            if (formerSize < 2) {
//                continue;
//            }
//            int slow = 0;
//            int fast = 0;
//            while (fast < formerSize) {
//                Schedule curr = dailySchedules.get(fast);
//                Schedule next = dailySchedules.get(fast + 1);
//
//                while (next != null
//                        && curr.getEndTime() == next.getStartTime()
//                        && curr.getName().equals(next.getName())) {
//                    curr = next;
//                    fast++;
//                    next = dailySchedules.get(fast);
//                }
//
//                Schedule merged = new Schedule(dailySchedules.get(slow).getStartTime(),
//                        dailySchedules.get(fast - 1).getEndTime(),
//                        curr.getName());
//
//                subList.add(merged);
//
//                slow = fast;
//                fast++;
//            }
//            newList.add(subList);
//        }
//        this.scheduleList = newList;
//    }

//        List<List<Schedule>> newList = new ArrayList<>(7);
//        for (List<Schedule> dailySchedules : this.scheduleList) {
//            if (dailySchedules.isEmpty()) {
//                continue;
//            }
//            dailySchedules.sort(Comparator.comparingLong(s -> s.getTimeRange().getStartTime()));
//            List<Schedule> merged = new ArrayList<>();
//            for (Schedule singleSchedule : dailySchedules) {
//                long L = singleSchedule.getTimeRange().getStartTime();
//                long R = singleSchedule.getTimeRange().getEndTime();
//                if ((merged.isEmpty() || merged.get(merged.size() - 1).getTimeRange().getEndTime() < L) && ) {
//                    merged.add(new Schedule(L, R, singleSchedule.getName()));
//                } else {
//                    merged.get(merged.size() - 1).getTimeRange()
//                            .setEndTime(Math.max(merged.get(merged.size() - 1).getTimeRange().getEndTime(), R));
//                }
//            }
//            newList.add(merged);
//        }
//        this.scheduleList = newList;
