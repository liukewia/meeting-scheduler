package com.uofg.timescheduler.common.dto;

import java.io.Serializable;
import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SheetsDto implements Serializable {

    @NotBlank
    private String uid;

    @NotBlank
    private String name;

    @NotBlank
    private String path;

}
