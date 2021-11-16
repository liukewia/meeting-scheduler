package com.uofg.timescheduler;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;

// temporarily exclude db connection
// https://blog.csdn.net/u012240455/article/details/82356075
@SpringBootApplication(exclude = {HibernateJpaAutoConfiguration.class})
public class TimeSchedulerApplication {

    public static void main(String[] args) {
        SpringApplication.run(TimeSchedulerApplication.class, args);
    }

}
