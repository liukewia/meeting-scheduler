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
 * ScheduleController Tester.
 *
 * @author <Authors name>
 * @version 1.0
 * @since <pre>12/16/2021</pre>
 */
public class ScheduleControllerTest extends TestCase {

    private MockMvc mockMvc;

    public ScheduleControllerTest(String name) {
        super(name);
    }

    public static Test suite() {
        return new TestSuite(ScheduleControllerTest.class);
    }

    public void setUp() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(new ScheduleController()).build();
    }

    public void tearDown() throws Exception {
        super.tearDown();
    }

    /**
     * Method: search(HttpServletRequest request, HttpServletResponse response)
     */
    public void testSearch() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/schedule/search?startTime=0&endTime=100")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andReturn();
    }

    /**
     * Method: add(@Validated @RequestBody ScheduleDto scheduleDto, HttpServletResponse response)
     */
    public void testAdd() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/schedule/add")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andReturn();
    }

    /**
     * Method: update(@Validated @RequestBody ScheduleDto scheduleDto, HttpServletResponse response)
     */
    public void testUpdate() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/schedule/update")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andReturn();
    }

    /**
     * Method: delete(@RequestBody ScheduleDto scheduleDto, HttpServletResponse response)
     */
    public void testDelete() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/schedule/delete")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andReturn();
    }
} 
