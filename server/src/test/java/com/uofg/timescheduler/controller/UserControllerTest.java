package com.uofg.timescheduler.controller;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

/**
 * UserController Tester.
 *
 * @author <Authors name>
 * @version 1.0
 * @since <pre>12/16/2021</pre>
 */
public class UserControllerTest extends TestCase {

    private MockMvc mockMvc;

    public UserControllerTest(String name) {
        super(name);
    }

    public static Test suite() {
        return new TestSuite(UserControllerTest.class);
    }

    public void setUp() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(new UserController()).build();
    }

    public void tearDown() throws Exception {
        super.tearDown();
    }

    /**
     * Method: login(@Validated @RequestBody LoginDto loginDto, HttpServletResponse response)
     */
    public void testLogin() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/user/login").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andReturn();
    }

    /**
     * Method: signup(@Validated @RequestBody SignUpDto signUpDto, HttpServletResponse response)
     */
    public void testSignup() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/user/signup")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andReturn();
    }

    /**
     * Method: current()
     */
    public void testCurrent() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/user/current").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andReturn();
    }

    /**
     * Method: allUsers()
     */
    public void testAllUsers() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/user/allUsers").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andReturn();
    }

    /**
     * Method: logout()
     */
    public void testLogout() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/user/logout").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andReturn();
    }
} 
