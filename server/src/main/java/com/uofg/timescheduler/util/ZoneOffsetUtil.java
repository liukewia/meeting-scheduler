package com.uofg.timescheduler.util;

import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.uofg.timescheduler.entity.ZoneOffset;
import com.uofg.timescheduler.service.ZoneOffsetService;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ZoneOffsetUtil {

    public static ZoneOffsetUtil that;
    @Autowired private ZoneOffsetService zoneOffsetService;

    public static long updateAndGetUtcOffsetBy(String zoneIdStr) {
        // update current utc offset by zoneIdStr, for dynamic offset reasons like daylight saving time.
        ZoneId zoneId = ZoneId.of(zoneIdStr);
        ZonedDateTime zdt = ZonedDateTime.now(zoneId);
        long newOffset = zdt.getOffset().getTotalSeconds() * 1000L;
        that.zoneOffsetService.update(new ZoneOffset(zoneIdStr, newOffset),
                new UpdateWrapper<ZoneOffset>().eq("zone_id", zoneIdStr));
        return newOffset;
    }

    public static long getUtcOffsetBy(String zoneIdStr) {
        return that.zoneOffsetService.getOne(new UpdateWrapper<ZoneOffset>()
                .eq("zone_id", zoneIdStr))
                .getCurrentUtcOffset();
    }

    @PostConstruct
    public void init() {
        that = this;
    }

}
