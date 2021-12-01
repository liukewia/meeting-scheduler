package com.uofg.timescheduler.controller;


import com.uofg.timescheduler.common.dto.PlanMeetingDto;
import com.uofg.timescheduler.common.lang.Result;
import com.uofg.timescheduler.service.PriorityService;
import com.uofg.timescheduler.service.ScheduleService;
import com.uofg.timescheduler.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@Slf4j
@RequestMapping("/api/meeting")
@Api(tags = "PlanMeetingController")
public class PlanMeetingController {

    @Autowired
    UserService userService;

    @Autowired
    ScheduleService scheduleService;

    @Autowired
    PriorityService priorityService;


    @RequiresAuthentication
    @PostMapping("/plan")
    @ApiOperation("plan a meeting")
    public Result planMeeting(@RequestBody PlanMeetingDto planMeetingDto, HttpServletResponse response) {

        return Result.succ(null);
    }
}
