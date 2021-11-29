package com.uofg.timescheduler.controller;

import cn.hutool.core.map.MapUtil;
import com.uofg.timescheduler.common.lang.Result;
import com.uofg.timescheduler.util.MultipartFileBuilder;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.Objects;
import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.MultipartResolver;

@CrossOrigin
@RestController
@Slf4j
@RequestMapping("/api")
@Api(tags = "PlanMeetingController")
public class UploadController {

    @Value("${spring.servlet.multipart.location}")
    private String savePath;

    @RequiresAuthentication
    @PostMapping("/sheet/upload")
    @ApiOperation("upload Sheet")
    public Result uploadSheet(HttpServletRequest request) {
        ApplicationContext applicationContext = WebApplicationContextUtils
                .getWebApplicationContext(request.getServletContext());
        MultipartHttpServletRequest multipartHttpServletRequest = Objects
                .requireNonNull(applicationContext)
                .getBean(MultipartResolver.class)
                .resolveMultipart(request);
        String filePath;
        try {
            filePath = new MultipartFileBuilder(multipartHttpServletRequest)
                    .setSavePath(savePath)
                    .setMaxSize("10MB")
                    .setFileExt("xls", "xlsx") // either one is ok
                    .addFieldName("file")
                    .save();
            return Result.succ(MapUtil.builder()
                    .put("filePath", filePath)
                    .map());
        } catch (Exception e) {
            return Result.succ(MapUtil.builder()
                    .put("reason", e.getMessage()) // failing
                    .map());
        }
    }
}
