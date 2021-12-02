package com.uofg.timescheduler.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.uofg.timescheduler.entity.UserRole;
import com.uofg.timescheduler.mapper.UserRoleMapper;
import com.uofg.timescheduler.service.UserRoleService;
import org.springframework.stereotype.Service;

/**
 * <p>
 * service implementation class
 * </p>
 *
 * @author Finn
 * @since 2021-11-21
 */
@Service
public class UserRoleServiceImpl extends ServiceImpl<UserRoleMapper, UserRole> implements UserRoleService {

}
