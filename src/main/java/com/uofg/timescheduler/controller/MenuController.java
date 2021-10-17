package com.uofg.timescheduler.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MenuController {

    @GetMapping("/Home")
    public String home() {
        return "Hello";
    }

}
