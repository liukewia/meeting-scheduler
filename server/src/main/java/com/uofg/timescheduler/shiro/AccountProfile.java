package com.uofg.timescheduler.shiro;


import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class AccountProfile implements Serializable {

    private Long id;
    private String username;
    private String avatar;
    private String email;
    private String status;
    private Integer role;
    private LocalDateTime created;
    private LocalDateTime last_login;
}
