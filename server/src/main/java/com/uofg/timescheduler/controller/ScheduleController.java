package com.uofg.timescheduler.controller;


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
 * 前端控制器
 * </p>
 *
 * @author Finn
 * @since 2021-11-21
 */
@CrossOrigin
@RestController
@Slf4j
@RequestMapping("/api/schedule")
public class ScheduleController {

    @Autowired
    UserService userService;

    @Autowired ScheduleService scheduleService;
    @Autowired PriorityService priorityService;


    // sending the time with offset back to the front end
    @RequiresAuthentication
    @PostMapping("/add")
    public Result add(@Validated @RequestBody ScheduleDto scheduleDto, HttpServletResponse response) {

        Schedule schedule = new Schedule();

        BeanUtil.copyProperties(scheduleDto, schedule, "id", "userId", "startTime", "endTime", "priority");

        // userid
        AccountProfile user = ShiroUtil.getProfile();
        Long userId = user.getId();
        schedule.setUserId(userId);

        // eliminate utc offset
        Long utcOffset = user.getUtcOffset();
        schedule.setStartTime(new Date(scheduleDto.getStartTime() - utcOffset));
        schedule.setEndTime(new Date(scheduleDto.getEndTime() - utcOffset));

        Long priorityId = scheduleDto.getPriority();
        Priority pri = priorityService.getOne(new QueryWrapper<Priority>().eq("id", priorityId));
        if (pri == null) {
            return Result.fail("Illegal priority id!");
        }
        schedule.setPriorityId(priorityId);

        scheduleService.save(schedule);

        return Result.succ(null);
    }

    //查找接口
    // 如果没说start end 就按照middate给前后三十天内事件
    // 如果说了就按和start end有everlap的查找
    @RequiresAuthentication
    @GetMapping("/search")
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
        if (midTimeStr != null) {
            // query by a mid date, need to show a range from 30th day before to 30th day after.
            long midTime = Long.parseLong(midTimeStr);
            scheduleList = scheduleService.list(new QueryWrapper<Schedule>()
                    .eq("user_id", userId)
                    .ge("start_time", DateUtil.date(midTime - 30 * TimeConsts.ONE_DAY_MILLIS - utcOffset).toJdkDate())
                    .lt("start_time", DateUtil.date(midTime + 30 * TimeConsts.ONE_DAY_MILLIS - utcOffset).toJdkDate())
                    .gt("end_time", DateUtil.date(midTime - 30 * TimeConsts.ONE_DAY_MILLIS - utcOffset).toJdkDate())
                    .le("end_time", DateUtil.date(midTime + 30 * TimeConsts.ONE_DAY_MILLIS - utcOffset).toJdkDate())
                    .select("id", "title", "start_time", "end_time", "priority_id", "location", "note"));
        }

        if (startTimeStr != null && endTimeStr != null) {
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
}
