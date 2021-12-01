package com.uofg.timescheduler.shiro;


import com.uofg.timescheduler.service.ZoneOffsetService;
import java.io.Serializable;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Data
public class AccountProfile implements Serializable {

    // use wrapped class, since values from database may be null but primitive vals cannnot be null
    private Long id;
    private String username;
    private String avatar;
    private String email;
    private String zoneId;
    private String status;
    private Long created;
    private Long lastLogin;

    @Autowired
    private ZoneOffsetService zoneOffsetService;

    public Long getCreatedTimeStamp() {
        return created / 1000;
    }

    public Long getLastLoginTimeStamp() {
        return lastLogin / 1000;
    }

}
