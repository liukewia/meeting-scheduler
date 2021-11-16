package com.uofg.timescheduler.common.lang;

import java.io.Serializable;
import lombok.Data;

@Data
public class Result implements Serializable {

    private int code;
    private String msg;
    private Object data;

    public static Result succ(Object data) {
        return succ("", data);
    }

    public static Result succ(String msg, Object data) {
        Result m = new Result();
        m.setCode(200);
        m.setData(data);
        m.setMsg(msg);
        return m;
    }

    public static Result fail(String msg) {
        return fail(msg, null);
    }

    public static Result fail(int code, String msg) {
        Result m = new Result();
        m.setCode(code);
        m.setMsg(msg);
        m.setData(null);
        return m;
    }

    public static Result fail(String msg, Object data) {
        return fail(400, msg, data);
    }

    public static Result fail(int code, String msg, Object data) {
        Result m = new Result();
        m.setCode(code);
        m.setData(data);
        m.setMsg(msg);
        return m;
    }

}