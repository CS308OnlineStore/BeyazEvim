package com.ardakkan.backend.controller;

import com.ardakkan.backend.entity.RefundRequest;
import com.ardakkan.backend.entity.RefundStatus;
import com.ardakkan.backend.service.RefundRequestService;
import com.ardakkan.backend.service.RevenueChartService;
import org.jfree.chart.JFreeChart;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class RefundAndRevenueControllerTest {

    private MockMvc mockMvc;

    @Mock
    private RefundRequestService refundRequestService;

    @Mock
    private RevenueChartService revenueChartService;

    @InjectMocks
    private RefundRequestController refundRequestController;

    @InjectMocks
    private RevenueReportController revenueReportController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(refundRequestController, revenueReportController).build();
    }

    // Tests for RefundRequestController
    @Test
    void getRefundRequests_shouldReturnListOfRefundRequests() throws Exception {
        List<RefundRequest> mockRefundRequests = Arrays.asList(
                new RefundRequest() {{ setId(1L); setStatus(RefundStatus.PENDING); }},
                new RefundRequest() {{ setId(2L); setStatus(RefundStatus.APPROVED); }}
        );

        when(refundRequestService.getAllRefundRequests(Optional.empty())).thenReturn(mockRefundRequests);

        mockMvc.perform(get("/api/refund-requests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }


    @Test
    void getMonthlyRevenuePdf_shouldReturnBadRequestOnInvalidDates() throws Exception {
        when(revenueChartService.calculateMonthlyData(any(), any()))
                .thenThrow(new IllegalArgumentException("Invalid date range"));

        mockMvc.perform(get("/api/reports/monthly-revenue")
                        .param("startDate", "2025-01-31")
                        .param("endDate", "2025-01-01")) // Invalid range
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid date range"));
    }
}
