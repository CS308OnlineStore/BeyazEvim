package com.ardakkan.backend.service.test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.ardakkan.backend.entity.*;
import com.ardakkan.backend.repo.OrderRepository;
import com.ardakkan.backend.repo.RefundRequestRepository;
import com.ardakkan.backend.service.RevenueChartService;

import org.jfree.chart.JFreeChart;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.awt.image.BufferedImage;
import java.time.LocalDateTime;
import java.util.*;

class RevenueChartServiceTest {

    @InjectMocks
    private RevenueChartService revenueChartService;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private RefundRequestRepository refundRequestRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void calculateMonthlyData_shouldReturnCorrectData_whenValidInput() {
        // Arrange
        LocalDateTime startDate = LocalDateTime.of(2023, 1, 1, 0, 0);
        LocalDateTime endDate = LocalDateTime.of(2023, 12, 31, 23, 59);

        List<Order> mockOrders = Arrays.asList(
            createOrder(1L, 100.0, OrderStatus.PURCHASED, LocalDateTime.of(2023, 1, 15, 0, 0)),
            createOrder(2L, 200.0, OrderStatus.CANCELED, LocalDateTime.of(2023, 2, 10, 0, 0))
        );

        List<RefundRequest> mockRefundRequests = Arrays.asList(
            createRefundRequest(1L, 50.0, RefundStatus.APPROVED, LocalDateTime.of(2023, 1, 20, 0, 0))
        );

        when(orderRepository.findOrdersByDateRange(startDate, endDate)).thenReturn(mockOrders);
        when(refundRequestRepository.findByDateRange(startDate, endDate)).thenReturn(mockRefundRequests);

        // Act
        Map<String, Map<String, Double>> result = revenueChartService.calculateMonthlyData(startDate, endDate);

        // Assert
        assertEquals(2, result.size());
        assertEquals(100.0, result.get("JANUARY").get("Revenue"));
        assertEquals(200.0, result.get("FEBRUARY").get("Cancelled"));
        assertEquals(50.0, result.get("JANUARY").get("Refund"));

        verify(orderRepository, times(1)).findOrdersByDateRange(startDate, endDate);
        verify(refundRequestRepository, times(1)).findByDateRange(startDate, endDate);
    }

    @Test
    void calculateMonthlyData_shouldThrowException_whenNoDataFound() {
        // Arrange
        LocalDateTime startDate = LocalDateTime.of(2023, 1, 1, 0, 0);
        LocalDateTime endDate = LocalDateTime.of(2023, 12, 31, 23, 59);

        when(orderRepository.findOrdersByDateRange(startDate, endDate)).thenReturn(Collections.emptyList());
        when(refundRequestRepository.findByDateRange(startDate, endDate)).thenReturn(Collections.emptyList());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
            revenueChartService.calculateMonthlyData(startDate, endDate)
        );

        assertEquals("No data found for the given date range.", exception.getMessage());
        verify(orderRepository, times(1)).findOrdersByDateRange(startDate, endDate);
        verify(refundRequestRepository, times(1)).findByDateRange(startDate, endDate);
    }

    @Test
    void createMonthlyRevenueChart_shouldReturnChart_whenValidInput() {
        // Arrange
        Map<String, Map<String, Double>> monthlyData = new HashMap<>();
        monthlyData.put("JANUARY", Map.of("Revenue", 100.0, "Cancelled", 50.0, "Refund", 30.0));
        monthlyData.put("FEBRUARY", Map.of("Revenue", 200.0, "Cancelled", 100.0, "Refund", 20.0));

        // Act
        JFreeChart chart = revenueChartService.createMonthlyRevenueChart(monthlyData);

        // Assert
        assertNotNull(chart);
        assertEquals("Monthly Revenue and Losses", chart.getTitle().getText());
    }

    @Test
    void generateMonthlyRevenuePdf_shouldGeneratePdf_whenValidInput() throws Exception {
        // Arrange
        JFreeChart mockChart = mock(JFreeChart.class);
        Map<String, Map<String, Double>> monthlyData = new HashMap<>();
        monthlyData.put("JANUARY", Map.of("Revenue", 100.0, "Cancelled", 50.0, "Refund", 30.0));

        // Mock chart behavior
        BufferedImage mockImage = new BufferedImage(500, 300, BufferedImage.TYPE_INT_RGB);
        when(mockChart.createBufferedImage(500, 300)).thenReturn(mockImage);

        // Act
        byte[] pdfData = revenueChartService.generateMonthlyRevenuePdf(mockChart, monthlyData);

        // Assert
        assertNotNull(pdfData);
        assertTrue(pdfData.length > 0);
    }

    // Helper methods to create mock entities
    private Order createOrder(Long id, double totalPrice, OrderStatus status, LocalDateTime orderDate) {
        Order order = new Order();
        order.setId(id);
        order.setTotalPrice(totalPrice);
        order.setStatus(status);
        order.setOrderDate(orderDate);
        return order;
    }

    private RefundRequest createRefundRequest(Long id, double unitPrice, RefundStatus status, LocalDateTime requestedAt) {
        RefundRequest refundRequest = new RefundRequest();
        refundRequest.setId(id);
        refundRequest.setRequestedAt(requestedAt);
        refundRequest.setStatus(status);

        OrderItem orderItem = new OrderItem();
        orderItem.setUnitPrice(unitPrice);
        refundRequest.setOrderItem(orderItem);

        return refundRequest;
    }
}
