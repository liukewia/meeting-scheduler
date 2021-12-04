package com.uofg.timescheduler.service.internal;

import static com.uofg.timescheduler.service.constant.TimeConsts.ONE_HOUR_MILLIS;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.TimeZone;
import lombok.Data;

@Data
public class TimeRange {

    protected long startTime;
    protected long endTime;

    /**
     * @param startTime
     * @param endTime
     */
    public TimeRange(long startTime, long endTime) {
        if (endTime < startTime) {
            throw new IllegalStateException("The end time is earlier than the start time!");
        }
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public boolean hasOverlapWith(List<Schedule> schedules) {
        return schedules.stream().anyMatch(schedule -> {
            TimeRange that = schedule.getTimeRange();
            return !(this.getEndTime() <= that.getStartTime()
                    || this.getStartTime() >= that.getEndTime());
        });
    }

    public boolean hasOverlapWith(TimeRange that) {
        return !(this.getEndTime() <= that.getStartTime()
                || this.getStartTime() >= that.getEndTime());
    }

    public boolean hasOverlapWith(Long startTime, Long endTime) {
        return !(this.getEndTime() <= startTime
                || this.getStartTime() >= endTime);
    }

    public boolean hasStrictOverlapWith(TimeRange that) {
        return !(this.getEndTime() < that.getStartTime()
                || this.getStartTime() > that.getEndTime());
    }

    public boolean contains(TimeRange that) {
        return that.getStartTime() >= this.getStartTime()
                && that.getEndTime() <= this.getEndTime();
    }

    public TimeRange getOverlapWith(TimeRange that) {
        long lower = Math.max(this.getStartTime(), that.getStartTime());
        long upper = Math.min(this.getEndTime(), that.getEndTime());
        if (lower < upper) {
            return new TimeRange(lower, upper);
        } else {
            return null;
        }
    }

    public List<TimeRange> getOverlapsWith(List<TimeRange> those) {
        // prerequisite: those has no overlaps
        List<TimeRange> res = new ArrayList<>();
        for (TimeRange that : those) {
            TimeRange overlap = this.getOverlapWith(that);
            if (overlap != null) {
                res.add(overlap);
            }
        }
        return res;
    }

    public List<TimeRange> getPossibleSlotsBy(long duration) {
        List<TimeRange> res = new ArrayList<>();
        long start = this.getStartTime();
        long end = start + duration;
        while (end <= this.getEndTime()) {
            res.add(new TimeRange(start, end));
            start += ONE_HOUR_MILLIS;
            end += ONE_HOUR_MILLIS;
        }
        return res;
    }

    /**
     * Utility method: calculate the length of the time span in number.
     */
    public long getLength() {
        return this.endTime - this.startTime;
    }

    // https://cloud.tencent.com/developer/article/1680014
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TimeRange that = (TimeRange) o;
        return startTime == that.getStartTime() && endTime == that.getEndTime();
    }

    @Override
    public int hashCode() {
        return Objects.hash(startTime, endTime);
    }

    @Override public String toString() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        java.util.Date startDate = new Date(startTime);
        String str1 = sdf.format(startDate);
        java.util.Date endDate = new Date(endTime);
        String str2 = sdf.format(endDate);
        return "TimeRange{" +
                "startDate=" + str1 +
                ", endDate=" + str2 +
                '}';
    }
}
