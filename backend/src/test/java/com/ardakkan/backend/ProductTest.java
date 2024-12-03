package com.ardakkan.backend;

import com.ardakkan.backend.dto.ProductModelDTO;
import com.ardakkan.backend.entity.ProductInstance;
import com.ardakkan.backend.entity.ProductInstanceStatus;
import com.ardakkan.backend.entity.ProductModel;
import com.ardakkan.backend.repo.ProductInstanceRepository;
import com.ardakkan.backend.repo.ProductModelRepository;
import com.ardakkan.backend.service.ProductInstanceService;
import com.ardakkan.backend.service.ProductModelService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    @Mock
    private ProductModelRepository productModelRepository;

    @Mock
    private ProductInstanceRepository productInstanceRepository;

    @InjectMocks
    private ProductModelService productModelService;

    @InjectMocks
    private ProductInstanceService productInstanceService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // Test for creating a ProductModel
    @Test
    void createProductModel_ShouldSaveAndReturnProductModel() {
        // Arrange
        ProductModel productModel = new ProductModel();
        productModel.setName("Test Product");

        when(productModelRepository.save(productModel)).thenReturn(productModel);

        // Act
        ProductModel createdProductModel = productModelService.createProductModel(productModel);

        // Assert
        assertNotNull(createdProductModel);
        assertEquals("Test Product", createdProductModel.getName());
        verify(productModelRepository, times(1)).save(productModel);
    }

    // Test for getting a ProductModel by ID
    @Test
    void getProductModelById_ShouldReturnProductModel_WhenExists() {
        // Arrange
        Long productModelId = 1L;
        ProductModel productModel = new ProductModel();
        productModel.setId(productModelId);

        when(productModelRepository.findById(productModelId)).thenReturn(Optional.of(productModel));

        // Act
        Optional<ProductModelDTO> result = productModelService.getProductModelDTOById(productModelId);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(productModelId, result.get().getId());
        verify(productModelRepository, times(1)).findById(productModelId);
    }

    // Test for creating a ProductInstance
    @Test
    void createProductInstance_ShouldSaveAndReturnProductInstance() {
        // Arrange
        Long productModelId = 1L;
        ProductInstance productInstance = new ProductInstance();
        productInstance.setSerialNumber("12345");

        ProductModel productModel = new ProductModel();
        productModel.setId(productModelId);

        when(productModelRepository.findById(productModelId)).thenReturn(Optional.of(productModel));
        when(productInstanceRepository.save(productInstance)).thenReturn(productInstance);

        // Act
        ProductInstance createdInstance = productInstanceService.createProductInstance(productInstance, productModelId);

        // Assert
        assertNotNull(createdInstance);
        assertEquals("12345", createdInstance.getSerialNumber());
        verify(productInstanceRepository, times(1)).save(productInstance);
    }

    // Test for getting a ProductInstance by ID
    @Test
    void getProductInstanceById_ShouldReturnProductInstance_WhenExists() {
        // Arrange
        Long productInstanceId = 1L;
        ProductInstance productInstance = new ProductInstance();
        productInstance.setId(productInstanceId);

        when(productInstanceRepository.findById(productInstanceId)).thenReturn(Optional.of(productInstance));

        // Act
        Optional<ProductInstance> result = productInstanceService.getProductInstanceById(productInstanceId);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(productInstanceId, result.get().getId());
        verify(productInstanceRepository, times(1)).findById(productInstanceId);
    }

    // Test for updating a ProductInstance
    @Test
    void updateProductInstance_ShouldUpdateAndReturnProductInstance() {
        // Arrange
        Long productInstanceId = 1L;
        ProductInstance existingInstance = new ProductInstance();
        existingInstance.setId(productInstanceId);
        existingInstance.setSerialNumber("12345");

        ProductInstance updatedInstance = new ProductInstance();
        updatedInstance.setSerialNumber("54321");

        when(productInstanceRepository.findById(productInstanceId)).thenReturn(Optional.of(existingInstance));
        when(productInstanceRepository.save(existingInstance)).thenReturn(updatedInstance);

        // Act
        ProductInstance result = productInstanceService.updateProductInstance(productInstanceId, updatedInstance);

        // Assert
        assertNotNull(result);
        assertEquals("54321", result.getSerialNumber());
        verify(productInstanceRepository, times(1)).save(existingInstance);
    }

 

}
