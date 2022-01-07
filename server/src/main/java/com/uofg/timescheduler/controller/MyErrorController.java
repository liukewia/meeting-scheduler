package com.uofg.timescheduler.controller;

import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.boot.autoconfigure.web.ErrorProperties;
import org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * https://www.yisu.com/zixun/541100.html
 */
@RestController
public class MyErrorController extends BasicErrorController {

    public MyErrorController() {
        super(new DefaultErrorAttributes(), new ErrorProperties());
    }

    @Override
    @RequestMapping(produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Map<String, Object>> error(HttpServletRequest request) {
        getErrorProperties().setIncludeException(true);
        getErrorProperties().setIncludeMessage(ErrorProperties.IncludeAttribute.ALWAYS);
        getErrorProperties().setIncludeStacktrace(ErrorProperties.IncludeAttribute.ALWAYS);
        Map<String, Object> body = getErrorAttributes(request, getErrorAttributeOptions(request, MediaType.ALL));
        HttpStatus status = getStatus(request);

        Map<String, Object> map = new HashMap<>();
        map.put("code", HttpStatus.BAD_REQUEST.value());
        map.put("msg", "".equals(body.get("message")) ? "Server error" : body.get("message"));
        map.put("data", null);
        return new ResponseEntity<>(map, status);
    }
}