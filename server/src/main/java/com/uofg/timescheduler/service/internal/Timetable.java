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
        this.owner = new User();
        this.scheduleList = null;
    }

    public void mergeSegmentedSchedules() {
        List<Schedule> oldList = this.scheduleList;
        int oldSize = oldList.size();
        List<Schedule> newList = new ArrayList<>(oldSize);
        int slow = 0;
        int fast = 0;
        while (fast < oldSize - 1) {
            Schedule curr = oldList.get(slow);
            Schedule next = oldList.get(fast + 1);

            while (next != null
                    && curr.getEndTime() == next.getStartTime()
                    && curr.getName().equals(next.getName())
                    && curr.getPriority() == next.getPriority()) {
                fast++;
                curr = oldList.get(fast);
                next = fast + 1 < oldSize ? oldList.get(fast + 1) : null;
            }

            Schedule prev = oldList.get(slow);
            if (slow == fast) {
                newList.add(prev);
            } else {
                Schedule merged = new Schedule(prev.getStartTime(),
                        curr.getEndTime(),
                        curr.getName(),
                        prev.getPriority());

                newList.add(merged);
            }
            slow = ++fast;
        }
        newList.addAll(oldList.subList(slow, oldList.size()));

        this.scheduleList = Collections.unmodifiableList(newList);
    }
}
