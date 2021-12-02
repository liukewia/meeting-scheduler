package com.uofg.timescheduler.shiro;


import java.io.Serializable;
import lombok.Data;
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
}
