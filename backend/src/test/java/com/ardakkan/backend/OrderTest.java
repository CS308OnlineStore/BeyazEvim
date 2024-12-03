package com.ardakkan.backend;

import com.ardakkan.backend.entity.*;
import com.ardakkan.backend.repo.*;
import com.ardakkan.backend.service.InvoiceService;
import com.ardakkan.backend.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderServiceTest {

    @InjectMocks
    private OrderService orderService;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private ProductInstanceRepository productInstanceRepository;

    @Mock
    private InvoiceService invoiceService;

    private Order mockOrder;
    private User mockUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Mock User
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");
        mockUser.setFirstName("John");

        // Mock Order
        mockOrder = new Order();
        mockOrder.setId(1L);
        mockOrder.setUser(mockUser);
        mockOrder.setStatus(OrderStatus.CART);
        mockOrder.setOrderDate(new Date());
        mockOrder.setTotalPrice(100.0);


        OrderItem mockOrderItem = new OrderItem();
        mockOrderItem.setId(1L);
        mockOrderItem.setQuantity(1);
        mockOrderItem.setUnitPrice(100.0);
        List<Long> productInstanceIds = new ArrayList<>();
        productInstanceIds.add(1L);
        mockOrderItem.setProductInstanceIds(productInstanceIds);
        mockOrder.setOrderItems(List.of(mockOrderItem));
    }

    @Test
    void testPurchaseCartItems() {
        // Mock repository behavior
        when(orderRepository.findById(1L)).thenReturn(Optional.of(mockOrder));
        when(productInstanceRepository.findById(1L))
                .thenReturn(Optional.of(new ProductInstance()));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(invoiceService.generateInvoicePdf(anyLong())).thenReturn(new byte[]{1, 2, 3});

        // Execute method
        ResponseEntity<byte[]> response = orderService.purchaseCartItems(1L);

        // Verify results
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("application/pdf", response.getHeaders().getContentType().toString());
        assertNotNull(response.getBody());

        // Verify interactions
        verify(orderRepository, times(2)).save(any(Order.class)); // Saved twice: once for status update, once for invoice
        verify(invoiceRepository, times(1)).save(any(Invoice.class));
        verify(productInstanceRepository, times(1)).findById(1L);
    }

    @Test
    void testDeleteOrder() {
        when(orderRepository.existsById(1L)).thenReturn(true);

        // Execute method
        orderService.deleteOrder(1L);

        // Verify interactions
        verify(orderRepository, times(1)).existsById(1L);
        verify(orderRepository, times(1)).deleteById(1L);
    }

    @Test
    void testUpdateOrder() {
        Order updatedOrder = new Order();
        updatedOrder.setStatus(OrderStatus.PURCHASED);
        updatedOrder.setTotalPrice(200.0);
        updatedOrder.setOrderItems(new ArrayList<>());

        when(orderRepository.findById(1L)).thenReturn(Optional.of(mockOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Execute method
        Order result = orderService.updateOrder(1L, updatedOrder);

        // Verify results
        assertEquals(OrderStatus.PURCHASED, result.getStatus());
        assertEquals(200.0, result.getTotalPrice());

        // Verify interactions
        verify(orderRepository, times(1)).findById(1L);
        verify(orderRepository, times(1)).save(any(Order.class));
    }
}
