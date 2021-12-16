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
 * UploadController Tester.
 *
 * @author <Authors name>
 * @version 1.0
 * @since <pre>12/16/2021</pre>
 */
public class UploadControllerTest extends TestCase {

    private MockMvc mockMvc;

    public UploadControllerTest(String name) {
        super(name);
    }

    public static Test suite() {
        return new TestSuite(UploadControllerTest.class);
    }

    public void setUp() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(new UploadController()).build();
    }

    public void tearDown() throws Exception {
        super.tearDown();
    }

    /**
     * Method: uploadSheet(HttpServletRequest request)
     */
    public void testUploadSheet() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/sheet/upload").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andReturn();
    }
} 
