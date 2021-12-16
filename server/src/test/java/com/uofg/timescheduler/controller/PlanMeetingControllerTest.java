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
 * PlanMeetingController Tester.
 *
 * @author <Authors name>
 * @version 1.0
 * @since <pre>12/16/2021</pre>
 */
public class PlanMeetingControllerTest extends TestCase {

    private MockMvc mockMvc;

    public PlanMeetingControllerTest(String name) {
        super(name);
    }

    public static Test suite() {
        return new TestSuite(PlanMeetingControllerTest.class);
    }

    public void setUp() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(new PlanMeetingController()).build();
    }

    public void tearDown() throws Exception {
        super.tearDown();
    }

    /**
     * Method: planMeeting(@RequestBody PlanMeetingDto planMeetingDto, HttpServletResponse response)
     */
    public void testPlanMeeting() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/meeting/plan").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andReturn();
    }
} 
