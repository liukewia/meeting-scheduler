package com.uofg.timescheduler.common.dto;

import java.io.Serializable;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class SignUpDto implements Serializable {

    @NotBlank(message = "Username cannot be blank.")
    @Length(max = 20, message = "The length of username cannot be larger than 20.")
    @Pattern(regexp = "^[A-Za-z0-9]*$", message = "Username constraint：At most 20 characters, including only english characters and digits")
    private String username;

    @NotBlank
    private String zoneId;

    @Email(message = "The email format is not correct.")
    private String email;

    @NotBlank(message = "Password cannot be blank.")
    private String password;

}
