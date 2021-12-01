package com.uofg.timescheduler.controller;


import cn.hutool.core.map.MapUtil;
import com.uofg.timescheduler.common.lang.Result;
import com.uofg.timescheduler.entity.ZoneOffset;
import com.uofg.timescheduler.service.ZoneOffsetService;
import io.swagger.annotations.ApiOperation;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * ZoneOffsetController
 * </p>
 *
 * @author Finn
 * @since 2021-11-30
 */
@RestController
@RequestMapping("/api/zoneoffset")
public class ZoneOffsetController {

    @Autowired ZoneOffsetService zoneOffsetService;

    /**
     * internal update zone_offset table.
     *
     * @return
     */
    public Result initOrUpdate() {
        for (String zoneid : ZoneId.getAvailableZoneIds()) {
            ZoneId zoneId = ZoneId.of(zoneid);
            ZonedDateTime zdt = ZonedDateTime.now(zoneId);
            long ms = zdt.getOffset().getTotalSeconds() * 1000L;
            ZoneOffset zoneOffset = new ZoneOffset(zoneid, ms);
            zoneOffsetService.save(zoneOffset);
        }
        return Result.succ(null);
    }

    @GetMapping("/getlist")
    @ApiOperation("get all pairs in zone_offset table.")
    public Result getList() {
        List<ZoneOffset> zoneOffsetList = zoneOffsetService.list();
        return Result.succ(MapUtil.builder()
                .put("zoneOffsetList",
                        zoneOffsetList.stream().map(zoneOffset -> MapUtil.builder()
                                .put("zoneId", zoneOffset.getZoneId())
                                .put("currentUtcOffset", zoneOffset.getCurrentUtcOffset())
                                .map()))
                .map());
    }

}
