package com.ardakkan.backend;

import com.ardakkan.backend.controller.HomePageController;
import com.ardakkan.backend.dto.ProductModelDTO;
import com.ardakkan.backend.service.ProductModelService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class HomePageControllerTest {

    @Mock
    private ProductModelService productModelService;

    @InjectMocks
    private HomePageController homePageController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getHomePageProducts_ShouldReturnProductModelDTOList() {
        // Arrange
        ProductModelDTO product1 = new ProductModelDTO();
        product1.setId(1L);
        product1.setName("Product 1");

        ProductModelDTO product2 = new ProductModelDTO();
        product2.setId(2L);
        product2.setName("Product 2");

        List<ProductModelDTO> mockProductList = Arrays.asList(product1, product2);

        when(productModelService.getAllProductModelsDTO()).thenReturn(mockProductList);

        // Act
        List<ProductModelDTO> result = homePageController.getHomePageProducts();

        // Assert
        assertEquals(2, result.size());
        assertEquals("Product 1", result.get(0).getName());
        assertEquals("Product 2", result.get(1).getName());
        verify(productModelService, times(1)).getAllProductModelsDTO();
    }
}
