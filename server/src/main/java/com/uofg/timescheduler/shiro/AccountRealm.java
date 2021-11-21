package com.uofg.timescheduler.shiro;

import cn.hutool.core.bean.BeanUtil;
import com.uofg.timescheduler.entity.User;
import com.uofg.timescheduler.service.UserService;
import com.uofg.timescheduler.util.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AccountRealm extends AuthorizingRealm {

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserService userService;

    @Override
    public boolean supports(AuthenticationToken token) {
        return token instanceof JwtToken;
    }

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        return null;
    }

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        JwtToken jwt = (JwtToken) token;

        log.info("jwt----------------->{}", jwt);

        String userId = jwtUtils.getClaimByToken((String) jwt.getPrincipal()).getSubject();

        User user = userService.getById(Long.parseLong(userId));
        if (user == null) {
            throw new UnknownAccountException("The account does not exist!");
        }
        if (user.getStatus() == -1) {
            throw new LockedAccountException("The account is locked!");
        }

        AccountProfile profile = new AccountProfile();
        BeanUtil.copyProperties(user, profile);

        log.info("profile----------------->{}", profile.toString());

        return new SimpleAuthenticationInfo(profile, jwt.getCredentials(), getName());
    }

}