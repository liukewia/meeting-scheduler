package com.uofg.timescheduler.controller;


import cn.hutool.core.map.MapUtil;
import cn.hutool.crypto.SecureUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.uofg.timescheduler.common.dto.LoginDto;
import com.uofg.timescheduler.common.dto.SignUpDto;
import com.uofg.timescheduler.common.lang.Result;
import com.uofg.timescheduler.entity.Role;
import com.uofg.timescheduler.entity.User;
import com.uofg.timescheduler.entity.UserRole;
import com.uofg.timescheduler.service.RoleService;
import com.uofg.timescheduler.service.UserRoleService;
import com.uofg.timescheduler.service.UserService;
import com.uofg.timescheduler.shiro.AccountProfile;
import com.uofg.timescheduler.util.JwtUtils;
import com.uofg.timescheduler.util.ShiroUtil;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
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
@CrossOrigin
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

    @PostMapping("/login")
    public Result login(@Validated @RequestBody LoginDto loginDto, HttpServletResponse response) {

        User user = userService.getOne(new QueryWrapper<User>().eq("username", loginDto.getUsername()));
        // should return with status code 200, but {data.code} being 400.
        if (user == null) {
            // in practice, if either account or password does not exist or is incorrect, the error info should be
            // 'either one is incorrect', i.e., reveals least information possible.
            return Result.fail("The account does not exist!");
        }
        if (!user.getPassword().equals(SecureUtil.md5(loginDto.getPassword()))) {
            return Result.fail("The password is incorrect!");
        }

        long userId = user.getId();
        String jwt = jwtUtils.generateToken(userId);

        UserRole userRole = userRoleService.getOne(new QueryWrapper<UserRole>().eq("user_id", userId));
        Role role = roleService.getById(userRole.getRoleId());

        // update last login time
        user.setLastLogin(new Date());
        userService.updateById(user);

        response.setHeader("Authorization", jwt);
        response.setHeader(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Authorization");

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

    @PostMapping("/signup")
    public Result signup(@Validated @RequestBody SignUpDto signUpDto, HttpServletResponse response) {
        User newUser = null;
        newUser = userService.getOne(new QueryWrapper<User>().eq("username", signUpDto.getUsername()));
        if (newUser != null) {
            return Result.fail("The username has been occupied!");
        }
        newUser = new User();
        newUser.setUsername(signUpDto.getUsername());
        newUser.setPassword(SecureUtil.md5(signUpDto.getPassword()));

        List<String> avatars = new ArrayList<>();
        avatars.add("https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png");
        avatars.add("https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png");
        avatars.add("https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png");
        avatars.add("https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png");
        avatars.add("https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png");
        avatars.add("https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png");

        newUser.setAvatar(avatars.get(new Random().nextInt(avatars.size())));
        newUser.setEmail(signUpDto.getEmail());

        Long utcOffset = signUpDto.getUtcOffset();
        if (utcOffset == null) {
            utcOffset = 0L;
        }
        newUser.setUtcOffset(utcOffset);
        newUser.setStatus(0);
        newUser.setCreated(new Date(System.currentTimeMillis()));
        userService.save(newUser);

        // update user-role
        Long userId = userService.getOne(new QueryWrapper<User>().eq("username", signUpDto.getUsername())).getId();
        UserRole userRole = new UserRole();
        userRole.setUserId(userId);
        userRole.setRoleId(2L); // ordinary member

        userRoleService.save(userRole);

        return Result.succ(null);
    }

    @RequiresAuthentication // done jwt validation here, including not passing it and passing an illegal one
    @GetMapping("/currentUser")
    public Result currentUser() {
        // https://blog.csdn.net/suki_rong/article/details/80445880
        AccountProfile user = ShiroUtil.getProfile();
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

}
