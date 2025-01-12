package com.ardakkan.backend.service.test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.ardakkan.backend.entity.*;
import com.ardakkan.backend.repo.*;
import com.ardakkan.backend.service.NotificationService;
import com.ardakkan.backend.service.RefundRequestService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

class RefundRequestServiceTest {

    @InjectMocks
    private RefundRequestService refundRequestService;

    @Mock
    private RefundRequestRepository refundRequestRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private ProductInstanceRepository productInstanceRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createRefundRequest_shouldCreateRefundRequest_whenValidInput() {
        // Arrange
        Long orderId = 1L;
        Long productModelId = 2L;

        Order mockOrder = new Order();
        mockOrder.setId(orderId);
        mockOrder.setStatus(OrderStatus.DELIVERED);
        User mockUser = new User();
        mockUser.setEmail("test@example.com");
        mockOrder.setUser(mockUser);

        OrderItem mockOrderItem = new OrderItem();
        mockOrderItem.setProductInstanceIds(new ArrayList<>(List.of(10L)));

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(mockOrder));
        when(orderItemRepository.findByOrderAndProductModelId(mockOrder, productModelId)).thenReturn(Optional.of(mockOrderItem));

        // Act
        refundRequestService.createRefundRequest(orderId, productModelId);

        // Assert
        verify(refundRequestRepository, times(1)).save(any(RefundRequest.class));
        verify(notificationService, times(1)).notifyRefundRequestCreated(eq("test@example.com"), any(RefundRequest.class));
    }

    @Test
    void createRefundRequest_shouldThrowException_whenOrderNotDelivered() {
        // Arrange
        Long orderId = 1L;
        Long productModelId = 2L;

        Order mockOrder = new Order();
        mockOrder.setId(orderId);
        mockOrder.setStatus(OrderStatus.PURCHASED);

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(mockOrder));

        // Act & Assert
        IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
                refundRequestService.createRefundRequest(orderId, productModelId));

        assertEquals("Only delivered orders can be refunded.", exception.getMessage());
        verify(refundRequestRepository, never()).save(any());
    }



  
    @Test
    void getAllRefundRequests_shouldReturnFilteredList_whenStatusIsPresent() {
        // Arrange
        RefundStatus status = RefundStatus.PENDING;
        List<RefundRequest> mockRefundRequests = List.of(new RefundRequest(), new RefundRequest());

        when(refundRequestRepository.findByStatus(status)).thenReturn(mockRefundRequests);

        // Act
        List<RefundRequest> result = refundRequestService.getAllRefundRequests(Optional.of(status));

        // Assert
        assertEquals(2, result.size());
        verify(refundRequestRepository, times(1)).findByStatus(status);
    }
}
