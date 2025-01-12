package com.ardakkan.backend.service.test;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.ardakkan.backend.entity.ProductModel;
import com.ardakkan.backend.entity.User;
import com.ardakkan.backend.repo.ProductModelRepository;
import com.ardakkan.backend.repo.UserRepository;
import com.ardakkan.backend.service.MailService;
import com.ardakkan.backend.service.NotificationService;

class NotificationServiceTest {

    @InjectMocks
    private NotificationService notificationService;

    @Mock
    private MailService mailService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductModelRepository productModelRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testNotifyUsersAboutDiscount() {
        // Test verileri oluştur
        Long productId = 1L;
        ProductModel product = new ProductModel();
        product.setId(productId);
        product.setName("Test Product");

        User user = new User();
        user.setEmail("test@example.com");
        user.setFirstName("John");

        // Mock davranışlarını tanımla
        when(productModelRepository.findById(productId)).thenReturn(Optional.of(product));
        when(userRepository.findAllByWishlistContaining(product)).thenReturn(Arrays.asList(user));

        // Metodu çağır
        notificationService.notifyUsersAboutDiscount(productId);

        // Mail gönderiminin doğruluğunu kontrol et
        verify(mailService, times(1)).sendSimpleMail(eq("test@example.com"), anyString(), contains("Test Product"));
    }

    @Test
    void testNotifyUsersAboutDiscount_ProductNotFound() {
        // Test verileri
        Long productId = 1L;

        // Mock davranışı: Ürün bulunamadığında hata fırlat
        when(productModelRepository.findById(productId)).thenReturn(Optional.empty());

        // Metodun hata fırlattığını doğrula
        assertThrows(IllegalArgumentException.class, () -> {
            notificationService.notifyUsersAboutDiscount(productId);
        });

        // Mail gönderilmediğini kontrol et
        verify(mailService, never()).sendSimpleMail(anyString(), anyString(), anyString());
    }
}
