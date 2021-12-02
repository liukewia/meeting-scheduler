package com.uofg.timescheduler.service.impl;

import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.uofg.timescheduler.entity.ZoneOffset;
import com.uofg.timescheduler.mapper.ZoneOffsetMapper;
import com.uofg.timescheduler.service.ZoneOffsetService;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import org.springframework.stereotype.Service;

/**
 * <p>
 * service implementation class
 * </p>
 *
 * @author Finn
 * @since 2021-11-30
 */
@Service
public class ZoneOffsetServiceImpl extends ServiceImpl<ZoneOffsetMapper, ZoneOffset> implements ZoneOffsetService {

    public long updateAndGetUtcOffsetBy(String zoneIdStr) {
        // update current utc offset by zoneIdStr, for dynamic offset reasons like daylight saving time.
        ZoneId zoneId = ZoneId.of(zoneIdStr);
        ZonedDateTime zdt = ZonedDateTime.now(zoneId);
        long newOffset = zdt.getOffset().getTotalSeconds() * 1000L;
        this.update(new ZoneOffset(zoneIdStr, newOffset),
                new UpdateWrapper<ZoneOffset>().eq("zone_id", zoneIdStr));
        return newOffset;
    }

    public long getUtcOffsetBy(String zoneIdStr) {
        return this.getOne(new UpdateWrapper<ZoneOffset>()
                .eq("zone_id", zoneIdStr))
                .getCurrentUtcOffset();
    }

}
