package com.uofg.timescheduler.common.dto;

import java.io.Serializable;
import java.util.List;
import javax.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Range;

@Data
public class PlanMeetingDto implements Serializable {

    @NotBlank
    @Range(min = 0, max = 1, message = "Illegal source.")
    private Integer participantSource;

    private List<Long> participantList;

    private List<SheetsDto> spreadsheets;

    @NotBlank
    private List<Long> dates;

    @NotBlank
    @Range(min = 1, max = 720, message = "The duration is in illegal range.")
    private Long duration;
}
