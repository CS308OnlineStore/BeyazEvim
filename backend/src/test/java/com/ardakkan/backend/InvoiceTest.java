package com.ardakkan.backend;

import com.ardakkan.backend.entity.*;
import com.ardakkan.backend.repo.InvoiceRepository;
import com.ardakkan.backend.repo.ProductModelRepository;
import com.ardakkan.backend.service.InvoiceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class InvoiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private ProductModelRepository productModelRepository;

    @InjectMocks
    private InvoiceService invoiceService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testUpdateInvoice() {
        // Arrange
        Long invoiceId = 1L;
        Invoice existingInvoice = new Invoice();
        existingInvoice.setId(invoiceId);
        existingInvoice.setTotalPrice(100.0);

        Invoice updatedInvoice = new Invoice();
        updatedInvoice.setTotalPrice(200.0);
        updatedInvoice.setDetails("Updated details");
        updatedInvoice.setCreatedAt(updatedInvoice.getCreatedAt());

        when(invoiceRepository.findById(invoiceId)).thenReturn(Optional.of(existingInvoice));
        when(invoiceRepository.save(existingInvoice)).thenReturn(existingInvoice);

        // Act
        Invoice result = invoiceService.updateInvoice(invoiceId, updatedInvoice);

        // Assert
        assertEquals(200.0, result.getTotalPrice());
        assertEquals("Updated details", result.getDetails());
        verify(invoiceRepository, times(1)).findById(invoiceId);
        verify(invoiceRepository, times(1)).save(existingInvoice);
    }

    @Test
    void testDeleteInvoice() {
        // Arrange
        Long invoiceId = 1L;
        when(invoiceRepository.existsById(invoiceId)).thenReturn(true);

        // Act
        invoiceService.deleteInvoice(invoiceId);

        // Assert
        verify(invoiceRepository, times(1)).existsById(invoiceId);
        verify(invoiceRepository, times(1)).deleteById(invoiceId);
    }


    @Test
    void testGetInvoiceById() {
        // Arrange
        Long invoiceId = 1L;
        Invoice mockInvoice = new Invoice();
        mockInvoice.setId(invoiceId);
        mockInvoice.setTotalPrice(300.0);

        User mockUser = new User();
        mockUser.setFirstName("John");
        mockUser.setLastName("Doe");
        mockInvoice.setUser(mockUser);

        when(invoiceRepository.findById(invoiceId)).thenReturn(Optional.of(mockInvoice));

        // Act
        Invoice result = invoiceService.findInvoiceById(invoiceId);

        // Assert
        assertNotNull(result);
        assertEquals(invoiceId, result.getId());
        assertEquals(300.0, result.getTotalPrice());
        assertEquals("John", result.getUser().getFirstName());
        assertEquals("Doe", result.getUser().getLastName());

        // Verify repository interaction
        verify(invoiceRepository, times(1)).findById(invoiceId);
    }

}
