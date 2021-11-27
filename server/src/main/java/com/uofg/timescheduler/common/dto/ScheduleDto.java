package com.uofg.timescheduler.common.dto;

import com.uofg.timescheduler.service.constant.TimeConsts;
import java.io.Serializable;
import javax.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Range;

@Data
public class ScheduleDto implements Serializable {

    private Long id;

    @NotBlank(message = "Title cannot be blank.")
    private String title;

    private String location;

    @Range(max = TimeConsts.MAX_TIME_MILLIS, message = "The time exceeds lower limit.")
    private Long startTime;

    @Range(max = TimeConsts.MAX_TIME_MILLIS, message = "The time exceeds upper limit.")
    private Long endTime;

    //    @Range(max = 100L, message = "The priority is in illegal range.")
    private Long priorityId;

    private String note;

}
