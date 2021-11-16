package com.uofg.timescheduler.common.exception;

import com.uofg.timescheduler.common.lang.Result;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.ShiroException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 401——ExpiredCredentialsException
     */
//    @ResponseStatus(HttpStatus.UNAUTHORIZED)
//    @ExceptionHandler(value = ExpiredCredentialsException.class)
//    public Result handler(ExpiredCredentialsException e) throws IOException {
//        log.error("ExpiredCredentialsException:-------------->{}", e.getMessage());
//        return Result.fail(HttpStatus.UNAUTHORIZED.value(), e.getMessage());
//    }

    /**
     * catch shiro exceptions
     */
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(value = ShiroException.class)
    public Result handler(ShiroException e) throws IOException {
        log.error("Shiro Exception:-------------->{}", e.getMessage());
        return Result.fail(HttpStatus.UNAUTHORIZED.value(), e.getMessage());
    }

    /**
     * 400
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(value = IllegalArgumentException.class)
    public Result handler(IllegalArgumentException e) throws IOException {
        log.error("Assert Exception:-------------->{}", e.getMessage());
        return Result.fail(HttpStatus.BAD_REQUEST.value(), e.getMessage());
    }

    /**
     * Entity Validation Exception handling
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public Result handler(MethodArgumentNotValidException e) throws IOException {
        log.error("Entity Validation Exception:-------------->{}", e.getMessage());

        BindingResult bindingResult = e.getBindingResult();
        ObjectError objectError = bindingResult.getAllErrors().stream().findFirst().get();
        return Result.fail(objectError.getDefaultMessage());
    }


    /**
     * 405——Method Not Allowed
     */
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    @ExceptionHandler(value = HttpRequestMethodNotSupportedException.class)
    public Result handler(HttpRequestMethodNotSupportedException e) throws IOException {
        log.error("Http Request Method Not Supported Exception:-------------->{}", e.getMessage());
        return Result.fail(HttpStatus.METHOD_NOT_ALLOWED.value(), e.getMessage());
    }

    /**
     * 404
     */
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(value = NoHandlerFoundException.class)
    public Result handler(NoHandlerFoundException e) throws IOException {
        log.error("NoHandlerFoundException:-------------->{}", e.getMessage());
        return Result.fail(HttpStatus.NOT_FOUND.value(), e.getMessage());
    }

    /**
     * 415——Unsupported Media Type
     */
    @ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
    @ExceptionHandler(value = HttpMediaTypeNotSupportedException.class)
    public Result handler(HttpMediaTypeNotSupportedException e) throws IOException {
        log.error("HttpMediaTypeNotSupportedException:-------------->{}", e.getMessage());
        return Result.fail(HttpStatus.UNSUPPORTED_MEDIA_TYPE.value(), e.getMessage());
    }

    /**
     * all other exceptions
     */
//    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
//    @ExceptionHandler
//    public Result globalException(HttpServletRequest request, Throwable ex) {
//        log.error("globalException:-------------->{}", ex.getMessage());
//        return Result.fail(HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage());
//    }
}