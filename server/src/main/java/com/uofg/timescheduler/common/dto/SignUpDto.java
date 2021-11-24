package com.uofg.timescheduler.common.dto;

import java.io.Serializable;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignUpDto implements Serializable {

    @NotBlank(message = "Username cannot be blank.")
    private String username;

    private Long utcOffset;

    @Email(message = "The email format is not correct.")
    private String email;

    @NotBlank(message = "Password cannot be blank.")
    private String password;

}
