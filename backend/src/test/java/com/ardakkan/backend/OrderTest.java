package com.ardakkan.backend;

import com.ardakkan.backend.dto.OrderDTO;
import com.ardakkan.backend.entity.*;
import com.ardakkan.backend.repo.*;
import com.ardakkan.backend.service.InvoiceService;
import com.ardakkan.backend.service.MailService;
import com.ardakkan.backend.service.OrderService;
import jakarta.mail.internet.MimeMessage;
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

    @Mock
    private MailService mailService;

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
    void testDeleteOrder() {
        when(orderRepository.existsById(1L)).thenReturn(true);

        // Execute method
        orderService.deleteOrder(1L);

        // Verify interactions
        verify(orderRepository, times(1)).existsById(1L);
        verify(orderRepository, times(1)).deleteById(1L);
    }
}
