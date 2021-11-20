package com.uofg.timescheduler.service.internal;

import com.uofg.timescheduler.util.TimeUtil;
import java.util.List;
import lombok.Data;

@Data
public class RatedTimeRange {

    private final TimeRange timeRange;
    private double score = 0.0;
    private String note = "";


    public RatedTimeRange(TimeRange timeRange, List<Timetable> ratingBasis) {
        this.timeRange = timeRange;
        this.score = ratingBasis.stream()
                .map(timetable -> TimeUtil.rate(this.timeRange, timetable))
                .reduce(Double::sum)
                .orElse(0.0);
    }

    public long getStartTime() {
        return this.getTimeRange().getStartTime();
    }

    public long getEndTime() {
        return this.getTimeRange().getEndTime();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        RatedTimeRange that = (RatedTimeRange) o;
        return this.getTimeRange().equals(that.getTimeRange());
    }

    @Override
    public int hashCode() {
        return this.getTimeRange().hashCode();
    }

}
