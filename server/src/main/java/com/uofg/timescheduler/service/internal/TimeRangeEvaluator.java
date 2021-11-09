package com.uofg.timescheduler.service.internal;

import cn.hutool.core.collection.BoundedPriorityQueue;
import com.uofg.timescheduler.utils.TimeUtil;
import java.util.List;
import java.util.Queue;
import lombok.Data;

@Data
public class TimeRangeEvaluator {

    private final TimeRange timeRange;
    private final List<List<Long>> peoplesPreferences;
    private double rating = 0.0;
    private String note = "";

    public TimeRangeEvaluator(TimeRange timeRange, List<List<Long>> preferences) {
        this.timeRange = timeRange;
        this.peoplesPreferences = preferences;
        computeRating();
    }

    public static Queue<TimeRangeEvaluator> getTopPreferredSlots(List<List<TimeRange>> intersections,
            List<List<Long>> preferences,
            int solutionNum) {
        Queue<TimeRangeEvaluator> q = new BoundedPriorityQueue<>(
                solutionNum,
                (e1, e2) -> Double.compare(e2.getRating(), e1.getRating()));
        for (List<TimeRange> ranges : intersections) {
            for (TimeRange range : ranges) {
                q.offer(new TimeRangeEvaluator(range, preferences));
            }
        }
        return q;
    }

    private void computeRating() {
        int peopleNum = peoplesPreferences.size();
        // First we must ensure that each person has the same weight in evaluating a time range.
        double weightForEachPerson = 1.0 / peopleNum;
        for (List<Long> preferencesOfEachPerson : peoplesPreferences) {
//                int preferenceNumForEachPerson = eachPersonPreferences.size();
            int size = preferencesOfEachPerson.size();
            double sum = (1.0 + size) * size / 2;
            for (int i = 0; i < size; i++) {
                long preference = preferencesOfEachPerson.get(i);
                if (TimeUtil.isMomentInRange(preference, timeRange)) {
                    rating += (size - i) / sum
                            * weightForEachPerson
                            // if the current time is close to the end time, lower the rating.
                            * (timeRange.getEndTime() - preference) / timeRange.getLength();
//                    System.err.println(this.timeRange);
//                    System.err.println("people idx: " + peoplesPreferences.indexOf(preferencesOfEachPerson));
//                    System.err.println("prfr idx: " + i);
//                    System.err.println("+weight: " + (size - i) / sum * weightForEachPerson);
                }
            }
        }
    }

    public void appendNotes(List<String> peopleNotAvailable) {
        this.note += String.join(", ", peopleNotAvailable)
                + " " + (peopleNotAvailable.size() > 1 ? "are" : "is")
                + " not available for this slot.";
    }

    public void appendNotes(String s) {
        this.note += s;
    }

}