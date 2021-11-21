package com.uofg.timescheduler.service.impl;

import com.uofg.timescheduler.entity.Role;
import com.uofg.timescheduler.mapper.RoleMapper;
import com.uofg.timescheduler.service.RoleService;
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
public class RoleServiceImpl extends ServiceImpl<RoleMapper, Role> implements RoleService {

}
