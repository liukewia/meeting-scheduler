package com.uofg.timescheduler.shiro;


import java.io.Serializable;
import lombok.Data;

@Data
public class AccountProfile implements Serializable {

    // use wrapped class, since values from database may be null but primitive vals cannnot be null
    private Long id;
    private String username;
    private String avatar;
    private String email;
    private Long utcOffset;
    private String status;
    //    private Integer role;
    private Long created;
    private Long lastLogin;

    public Long getUtcOffsetTimeStamp() {
        return utcOffset / 1000;
    }

    public Long getCreatedTimeStamp() {
        return created / 1000;
    }

    public Long getLastLoginTimeStamp() {
        return lastLogin / 1000;
    }
}
