package com.uofg.timescheduler.util;

import com.uofg.timescheduler.service.internal.TimeRange;
import java.util.ArrayList;
import java.util.List;

public class AlgorithmUtil {

    /**
     * time complexity: O(A.length + B.length)
     * space complexity: O(A.length + B.length)
     *
     * @param A
     * @param B
     * @return
     */
    public static List<TimeRange> intervalIntersection(List<TimeRange> A, List<TimeRange> B) {
        List<TimeRange> ans = new ArrayList<>();
        int i = 0, j = 0;

        while (i < A.size() && j < B.size()) {
            // lo - the startpoint of the intersection
            // hi - the endpoint of the intersection
            long lo = Math.max(A.get(i).getStartTime(), B.get(j).getStartTime());
            long hi = Math.min(A.get(i).getEndTime(), B.get(j).getEndTime());
            if (lo < hi) {
                ans.add(new TimeRange(lo, hi));
            }

            // Remove the interval with the smallest endpoint
            if (A.get(i).getEndTime() < B.get(j).getEndTime()) {
                i++;
            } else {
                j++;
            }
        }
        return ans;
    }

    public static List<TimeRange> getSlotAdjacentTo(TimeRange source) {
        List<TimeRange> res = new ArrayList<>(2);
        long durationMillis = source.getLength();
        res.add(new TimeRange(source.getStartTime() - durationMillis, source.getStartTime()));
        res.add(new TimeRange(source.getEndTime(), source.getEndTime() + durationMillis));
        return res;
    }

}
