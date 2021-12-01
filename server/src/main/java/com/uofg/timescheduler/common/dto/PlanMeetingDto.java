package com.uofg.timescheduler.common.dto;

import java.io.Serializable;
import java.util.List;
import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PlanMeetingDto implements Serializable {

    @NotBlank
    private Integer participantSource;

    private List<Long> participantList;

    private List<SheetsDto> spreadsheets;

    @NotBlank
    private List<Long> dates;

    @NotBlank
    private Long duration;
}
