package com.ardakkan.backend.service.test;

import com.ardakkan.backend.entity.ProductInstance;
import com.ardakkan.backend.entity.ProductInstanceStatus;
import com.ardakkan.backend.entity.ProductModel;
import com.ardakkan.backend.repo.ProductInstanceRepository;
import com.ardakkan.backend.repo.ProductModelRepository;
import com.ardakkan.backend.service.ProductInstanceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class product_instance_srvice_test {

    @Mock
    private ProductInstanceRepository productInstanceRepository;

    @Mock
    private ProductModelRepository productModelRepository;

    @InjectMocks
    private ProductInstanceService productInstanceService;

    private ProductInstance productInstance;
    private ProductModel productModel;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        productModel = new ProductModel();
        productModel.setId(1L);

        productInstance = new ProductInstance();
        productInstance.setId(1L);
        productInstance.setSerialNumber("12345");
        productInstance.setStatus(ProductInstanceStatus.IN_CART);
        productInstance.setProductModel(productModel);
    }

    @Test
    void testCreateProductInstance() {
        when(productModelRepository.findById(1L)).thenReturn(Optional.of(productModel));
        when(productInstanceRepository.save(any(ProductInstance.class))).thenReturn(productInstance);

        ProductInstance createdInstance = productInstanceService.createProductInstance(productInstance, 1L);

        assertNotNull(createdInstance);
        assertEquals("12345", createdInstance.getSerialNumber());
        verify(productInstanceRepository, times(1)).save(any(ProductInstance.class));
    }

    @Test
    void testGetProductInstanceById() {
        when(productInstanceRepository.findById(1L)).thenReturn(Optional.of(productInstance));

        Optional<ProductInstance> retrievedInstance = productInstanceService.getProductInstanceById(1L);

        assertTrue(retrievedInstance.isPresent());
        assertEquals("12345", retrievedInstance.get().getSerialNumber());
        verify(productInstanceRepository, times(1)).findById(1L);
    }

    @Test
    void testGetAllProductInstances() {
        List<ProductInstance> instances = Arrays.asList(productInstance);
        when(productInstanceRepository.findAll()).thenReturn(instances);

        List<ProductInstance> allInstances = productInstanceService.getAllProductInstances();

        assertEquals(1, allInstances.size());
        assertEquals("12345", allInstances.get(0).getSerialNumber());
        verify(productInstanceRepository, times(1)).findAll();
    }

    @Test
    void testUpdateStatus() {
        when(productInstanceRepository.findById(1L)).thenReturn(Optional.of(productInstance));
        when(productInstanceRepository.save(any(ProductInstance.class))).thenReturn(productInstance);

        ProductInstance updatedInstance = productInstanceService.updateStatus(1L, ProductInstanceStatus.SOLD);

        assertNotNull(updatedInstance);
        assertEquals(ProductInstanceStatus.SOLD, updatedInstance.getStatus());
        verify(productInstanceRepository, times(1)).save(any(ProductInstance.class));
    }

    @Test
    void testDeleteProductInstance() {
        when(productInstanceRepository.existsById(1L)).thenReturn(true);
        doNothing().when(productInstanceRepository).deleteById(1L);

        productInstanceService.deleteProductInstance(1L);

        verify(productInstanceRepository, times(1)).deleteById(1L);
    }
}
