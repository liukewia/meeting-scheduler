package com.uofg.timescheduler.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.uofg.timescheduler.entity.User;
import com.uofg.timescheduler.mapper.UserMapper;
import com.uofg.timescheduler.service.UserService;
import org.springframework.stereotype.Service;

/**
 * <p>
 * service implementation class
 * </p>
 *
 * @author Yi Liu
 * @since 2021-11-21
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

}
