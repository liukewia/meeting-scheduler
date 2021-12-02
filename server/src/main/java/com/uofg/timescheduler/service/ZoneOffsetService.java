package com.uofg.timescheduler.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.uofg.timescheduler.entity.ZoneOffset;

/**
 * <p>
 * service class
 * </p>
 *
 * @author Finn
 * @since 2021-11-30
 */
public interface ZoneOffsetService extends IService<ZoneOffset> {

    long updateAndGetUtcOffsetBy(String zoneIdStr);

    long getUtcOffsetBy(String zoneIdStr);
}
