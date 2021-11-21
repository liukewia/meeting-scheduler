package com.uofg.timescheduler.service.impl;

import com.uofg.timescheduler.entity.Schedule;
import com.uofg.timescheduler.mapper.ScheduleMapper;
import com.uofg.timescheduler.service.ScheduleService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author Finn
 * @since 2021-11-21
 */
@Service
public class ScheduleServiceImpl extends ServiceImpl<ScheduleMapper, Schedule> implements ScheduleService {

}
