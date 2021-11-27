package com.uofg.timescheduler.controller;


import static com.uofg.timescheduler.service.constant.TimeConsts.ONE_MINUTE_MILLIS;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.map.MapUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.uofg.timescheduler.common.dto.ScheduleDto;
import com.uofg.timescheduler.common.lang.Result;
import com.uofg.timescheduler.entity.Priority;
import com.uofg.timescheduler.entity.Schedule;
import com.uofg.timescheduler.entity.User;
import com.uofg.timescheduler.service.PriorityService;
import com.uofg.timescheduler.service.ScheduleService;
import com.uofg.timescheduler.service.UserService;
import com.uofg.timescheduler.service.constant.TimeConsts;
import com.uofg.timescheduler.shiro.AccountProfile;
import com.uofg.timescheduler.util.ShiroUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * ScheduleController
 * </p>
 *
 * @author Finn
 * @since 2021-11-21
 */
@CrossOrigin
@RestController
@Slf4j
@RequestMapping("/api/schedule")
@Api(tags = "Schedule Controller")
public class ScheduleController {

    @Autowired
    UserService userService;

    @Autowired ScheduleService scheduleService;
    @Autowired PriorityService priorityService;


    /**
     * Search schedules by a range
     * If start and end are not specified, while a middate is specified in the request body, it will search schedules in
     * the last 30 days and in the next 30 days.
     * If start and end are specified, find all schedules that overlap with this time range.
     *
     * @param request
     * @param response
     * @return
     */
    @RequiresAuthentication
    @GetMapping("/search")
    @ApiOperation("search schedules")
    public Result search(HttpServletRequest request, HttpServletResponse response) {
        AccountProfile user = ShiroUtil.getProfile();

        // get user info from jwt in header
        Long userId = user.getId();
        Long utcOffset = user.getUtcOffset();
        User userInDatabase = userService.getOne(new QueryWrapper<User>().eq("id", userId));
        if (userInDatabase == null) {
            return Result.fail("The user does not exist!");
        }

        String midTimeStr = request.getParameter("midTime");
        String startTimeStr = request.getParameter("startTime");
        String endTimeStr = request.getParameter("endTime");
        List<Schedule> scheduleList = new ArrayList<>();
        if (midTimeStr != null && startTimeStr == null && endTimeStr == null) {
            // query by a mid date, need to show a range from 30th day before to 30th day after.
            long midTime = Long.parseLong(midTimeStr);
            scheduleList = scheduleService.list(new QueryWrapper<Schedule>()
                    .eq("user_id", userId)
                    // https://baomidou.com/guide/wrapper.html#abstractwrapper
                    .ge("start_time", DateUtil.date(midTime - 30 * TimeConsts.ONE_DAY_MILLIS - utcOffset).toJdkDate())
                    .lt("start_time", DateUtil.date(midTime + 30 * TimeConsts.ONE_DAY_MILLIS - utcOffset).toJdkDate())
                    .gt("end_time", DateUtil.date(midTime - 30 * TimeConsts.ONE_DAY_MILLIS - utcOffset).toJdkDate())
                    .le("end_time", DateUtil.date(midTime + 30 * TimeConsts.ONE_DAY_MILLIS - utcOffset).toJdkDate())
                    .select("id", "title", "start_time", "end_time", "priority_id", "location", "note"));
        } else if (midTimeStr == null && startTimeStr != null && endTimeStr != null) {
            long startTime = Long.parseLong(startTimeStr);
            Date startDate = DateUtil.date(startTime - utcOffset).toJdkDate();
            long endTime = Long.parseLong(endTimeStr);
            Date endDate = DateUtil.date(endTime - utcOffset).toJdkDate();
            scheduleList = scheduleService.list(new QueryWrapper<Schedule>()
                    .eq("user_id", userId)
                    .lt("start_time", endDate)
                    .gt("end_time", startDate)
                    .orderByAsc("id")
                    .select("id", "title", "start_time", "end_time", "priority_id", "location", "note"));
        } else {
            return Result.fail("Illegal param combination.");
        }

        // distribute time with offset registered
        scheduleList = scheduleList.stream()
                .peek(schedule -> {
                    schedule.setStartTime(new Date(schedule.getStartTime().getTime() + utcOffset));
                    schedule.setEndTime(new Date(schedule.getEndTime().getTime() + utcOffset));
                })
                .collect(Collectors.toList());

        return Result.succ(MapUtil.builder()
                .put("schedules", scheduleList)
                .map()
        );

    }


    // sending the time with offset back to the front end
    @RequiresAuthentication
    @PostMapping("/add")
    @ApiOperation("add schedules")
    public Result add(@Validated @RequestBody ScheduleDto scheduleDto, HttpServletResponse response) {

        Schedule schedule = new Schedule();

        BeanUtil.copyProperties(scheduleDto, schedule, "id", "userId", "startTime", "endTime", "priority");

        // userid
        AccountProfile user = ShiroUtil.getProfile();
        Long userId = user.getId();
        schedule.setUserId(userId);

        // eliminate utc offset
        Long utcOffset = user.getUtcOffset();
        long newStartTime = scheduleDto.getStartTime() - utcOffset;
        schedule.setStartTime(new Date(newStartTime));
        long newEndTime = scheduleDto.getEndTime() - utcOffset;
        if (newEndTime <= newStartTime) {
            newEndTime = newStartTime + ONE_MINUTE_MILLIS;
        }
        schedule.setEndTime(new Date(newEndTime));

        Long priorityId = scheduleDto.getPriorityId();
        Priority pri = priorityService.getOne(new QueryWrapper<Priority>().eq("id", priorityId));
        if (pri == null) {
            return Result.fail("Illegal priority id!");
        }
        schedule.setPriorityId(priorityId);

        scheduleService.save(schedule);

        return Result.succ(null);
    }

    @RequiresAuthentication
    @PostMapping("/update")
    @ApiOperation("update schedules")
    public Result update(@Validated @RequestBody ScheduleDto scheduleDto, HttpServletResponse response) {

        Schedule schedule = new Schedule();

        BeanUtil.copyProperties(scheduleDto, schedule, "userId", "startTime", "endTime", "priority");

        // userid
        AccountProfile user = ShiroUtil.getProfile();
        Long userId = user.getId();
        schedule.setUserId(userId);

        // check that if the schedule exists and belongs to the user
        Schedule scheduleInDatabase = scheduleService.getOne(new QueryWrapper<Schedule>()
                .eq("user_id", userId)
                .eq("id", schedule.getId())
        );
        if (scheduleInDatabase == null) {
            return Result.fail("No such schedule, update failed.");
        }

        Long priorityId = scheduleDto.getPriorityId();
        Priority pri = priorityService.getOne(new QueryWrapper<Priority>().eq("id", priorityId));
        if (pri == null) {
            return Result.fail("Illegal priority id.");
        }
        schedule.setPriorityId(priorityId);

        // eliminate utc offset
        Long utcOffset = user.getUtcOffset();
        long newStartTime = scheduleDto.getStartTime() - utcOffset;
        schedule.setStartTime(new Date(newStartTime));
        long newEndTime = scheduleDto.getEndTime() - utcOffset;
        if (newEndTime <= newStartTime) {
            newEndTime = newStartTime + ONE_MINUTE_MILLIS;
        }
        schedule.setEndTime(new Date(newEndTime));

        scheduleService.updateById(schedule);

        return Result.succ(null);
    }

    @RequiresAuthentication
    @PostMapping("/delete")
    @ApiOperation("delete schedules")
    public Result delete(@RequestBody ScheduleDto scheduleDto, HttpServletResponse response) {

        Schedule schedule = new Schedule();

        BeanUtil.copyProperties(scheduleDto, schedule, "title", "location", "startTime", "endTime", "priority", "note");

        if (schedule.getId() == null) {
            return Result.fail("Schedule ID is required for this operation.");
        }

        Long userId = ShiroUtil.getProfile().getId();

        // check that if the schedule exists and belongs to the user
        Schedule scheduleInDatabase = scheduleService.getOne(new QueryWrapper<Schedule>()
                .eq("user_id", userId)
                .eq("id", schedule.getId())
        );
        if (scheduleInDatabase == null) {
            return Result.fail("No such schedule, delete failed.");
        }

        scheduleService.removeById(schedule.getId());

        return Result.succ(null);
    }
}
