package com.uofg.timescheduler.service.internal;

import static com.uofg.timescheduler.constant.TimeConstant.ONE_HOUR_MILLIS;
import static com.uofg.timescheduler.constant.TimeConstant.UTC_LOWER_BOUND;
import static com.uofg.timescheduler.constant.TimeConstant.UTC_UPPER_BOUND;

import com.uofg.timescheduler.utils.TimeUtil;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import lombok.Data;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.math3.exception.OutOfRangeException;

@Data
@Log4j2
//@Entity
public class User {


    private Integer id;
    private String Name;
    // ranges from -12 to +14, the smallest decimal possible is 1/4 (see Nepal). Chose UTC rather than GMT as the standard.
    // https://www.zhihu.com/question/20705971
    private Float UTCTimeZone;
    private List<Long> preferences;

    public User() {
        this.preferences = new ArrayList<>();
    }

    public void setUTCTimeZone(Float temp) {
        if (!TimeUtil.isUTCTimeZoneValid(temp)) {
            throw new OutOfRangeException(temp, UTC_LOWER_BOUND, UTC_UPPER_BOUND);
        }
        this.UTCTimeZone = temp;
    }

    public void updateCorrespondingField(String key, String value) {
        // prevents errors from users mixing upper and lower cases when setting keys.
        String lowerCaseKey = key.toLowerCase();
        if (lowerCaseKey.equals("id")) {
            this.setId(Integer.parseInt(value));
            return;
        }
        if (lowerCaseKey.equals("name")) {
            this.setName(value);
            return;
        }
        if (lowerCaseKey.equals("time zone")) {
            float temp;
            try {
                temp = TimeUtil.parseTimeZone(value);
                this.setUTCTimeZone(temp); // The time zone deviation could be decimal numbers, like +10.5, -2.25.
            } catch (Exception e) {
                log.error("Cannot set user's time zone!");
                e.printStackTrace();
            }
            return;
        }
        if (Pattern.matches("^preference[0-9]+$", lowerCaseKey)) {
            if (value == null) {
                // this preference is null
                return;
            }
            if (this.UTCTimeZone == null) {
                log.error("UTC time zone of this user have not been set, cannot calibrate time!");
                return;
            }
            // restrict each preference to be a moment, not a time range for now.
            try {
                this.getPreferences()
                        .add(TimeUtil.parseMoment(value) - ((long) Math.round(this.UTCTimeZone * ONE_HOUR_MILLIS)));
            } catch (Exception e) {
                log.error("Cannot set user's time preferences!");
                e.printStackTrace();
            }
            return;
        }
        log.error("Unrecognized field with data key {} and value {} !", key, value);
    }
}
