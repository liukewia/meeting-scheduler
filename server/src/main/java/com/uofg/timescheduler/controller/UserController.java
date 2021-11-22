package com.uofg.timescheduler.controller;


import cn.hutool.core.lang.Assert;
import cn.hutool.core.map.MapUtil;
import cn.hutool.crypto.SecureUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.uofg.timescheduler.common.dto.LoginDto;
import com.uofg.timescheduler.common.lang.Result;
import com.uofg.timescheduler.entity.Role;
import com.uofg.timescheduler.entity.User;
import com.uofg.timescheduler.entity.UserRole;
import com.uofg.timescheduler.service.RoleService;
import com.uofg.timescheduler.service.UserRoleService;
import com.uofg.timescheduler.service.UserService;
import com.uofg.timescheduler.shiro.AccountProfile;
import com.uofg.timescheduler.util.JwtUtils;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
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
 * Front end Controller
 * </p>
 *
 * @author Yi Liu
 * @since 2021-11-21
 */
@RestController
@Slf4j
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserService userService;

    @Autowired UserRoleService userRoleService;

    @Autowired RoleService roleService;

    @RequiresAuthentication
    @GetMapping("/index")
    public Result index() {
        User user = userService.getById(1L);
        return Result.succ(user);
    }

    @CrossOrigin
    @PostMapping("/login")
    public Result login(@Validated @RequestBody LoginDto loginDto, HttpServletResponse response) {

        User user = userService.getOne(new QueryWrapper<User>().eq("username", loginDto.getUsername()));
        Assert.notNull(user, "The account does not exist!");

        if (!user.getPassword().equals(SecureUtil.md5(loginDto.getPassword()))) {
            return Result.fail("The password is incorrect!");
        }

        long userId = user.getId();
        String jwt = jwtUtils.generateToken(userId);

        UserRole userRole = userRoleService.getOne(new QueryWrapper<UserRole>().eq("user_id", userId));
        Role role = roleService.getById(userRole.getRoleId());

        // TODO update last login time

        response.setHeader("Authorization", jwt);
        response.setHeader("Access-Control-Expose-Headers", "Authorization");

        return Result.succ(MapUtil.builder()
                .put("id", user.getId())
                .put("username", user.getUsername())
                .put("avatar", user.getAvatar())
                .put("email", user.getEmail())
                .put("utcOffset", user.getUtcOffset())
                .put("access", role.getName())
                .map()
        );
    }

    @RequiresAuthentication // done jwt validation here, including not passing it and passing an illegal one
    @GetMapping("/currentUser")
    public Result currentUser() {
        // https://blog.csdn.net/suki_rong/article/details/80445880
        AccountProfile user = ((AccountProfile) SecurityUtils.getSubject().getPrincipal());
        UserRole userRole = userRoleService.getOne(new QueryWrapper<UserRole>().eq("user_id", user.getId()));
        Role role = roleService.getById(userRole.getRoleId());
        return Result.succ(MapUtil.builder()
                .put("id", user.getId())
                .put("username", user.getUsername())
                .put("avatar", user.getAvatar())
                .put("email", user.getEmail())
                .put("utcOffset", user.getUtcOffset())
                .put("access", role.getName())
                .map()
        );
    }

    @RequiresAuthentication
    @PostMapping("/logout")
    public Result logout() {
        // https://segmentfault.com/q/1010000010043871/a-1020000040644951
        // since using jwt, the logout behavior is null, need not redis environment installed anymore
//        SecurityUtils.getSubject().logout();
        return Result.succ(null);
    }


    @PostMapping("/save")
    public Result save(@Validated @RequestBody User user) {
        return Result.succ(user);
    }
}
