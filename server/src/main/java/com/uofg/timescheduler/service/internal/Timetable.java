package com.uofg.timescheduler.service.internal;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import lombok.Data;

@Data
public class Timetable {

    private TimeRange coverage;
    private List<Schedule> scheduleList;
    private User owner;

    public Timetable() {
        this.scheduleList = new ArrayList<>();
        this.owner = new User();
    }

    public void mergeSegmentedSchedules() {

        List<Schedule> oldList = this.scheduleList;
        int formerSize = oldList.size();
        List<Schedule> newList = new ArrayList<>(formerSize);
        int slow = 0;
        int fast = 0;
        while (fast < formerSize - 1) {
            Schedule curr = oldList.get(slow);
            Schedule next = oldList.get(fast + 1);

            while (next != null
                    && curr.getEndTime() == next.getStartTime()
                    && curr.getName().equals(next.getName())
                    && curr.getPriority() == next.getPriority()) {
                fast++;
                curr = oldList.get(fast);
                next = fast + 1 < formerSize ? oldList.get(fast + 1) : null;
            }

            Schedule prev = oldList.get(slow);
            if (slow == fast) {
                newList.add(prev);
            } else {
                Schedule merged = new Schedule(prev.getStartTime(),
                        curr.getEndTime(),
                        curr.getName(), SchedulePriority.NORMAL);

                newList.add(merged);
            }
            slow = ++fast;
        }
        newList.addAll(oldList.subList(slow, oldList.size()));

        this.scheduleList = Collections.unmodifiableList(newList);
    }
}
