package com.uofg.timescheduler.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 *
 * </p>
 *
 * @author Finn
 * @since 2021-11-30
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("zone_offset")
public class ZoneOffset implements Serializable {

    private static final long serialVersionUID = 1L;

    private String zoneId;

    private Long currentUtcOffset;

    public ZoneOffset() {
    }

    public ZoneOffset(String zoneId, Long currentUtcOffset) {
        this.zoneId = zoneId;
        this.currentUtcOffset = currentUtcOffset;
    }
}
