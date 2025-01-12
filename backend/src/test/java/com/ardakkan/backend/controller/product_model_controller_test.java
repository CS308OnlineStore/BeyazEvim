package com.ardakkan.backend.controller;

import com.ardakkan.backend.dto.ProductModelDTO;
import com.ardakkan.backend.entity.ProductModel;
import com.ardakkan.backend.service.ProductModelService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProductModelControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProductModelService productModelService;

    @InjectMocks
    private ProductModelController productModelController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(productModelController).build();
    }

    @Test
    void getAllProductModels_shouldReturnListOfProductModels() throws Exception {
        List<ProductModelDTO> mockProductModels = Arrays.asList(
                new ProductModelDTO() {{ setId(1L); setName("Product A"); }},
                new ProductModelDTO() {{ setId(2L); setName("Product B"); }}
        );

        when(productModelService.getAllProductModelsDTO()).thenReturn(mockProductModels);

        mockMvc.perform(get("/api/product-models"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    void createProductModel_shouldReturnCreatedProductModel() throws Exception {
        ProductModel productModel = new ProductModel();
        productModel.setId(1L);
        productModel.setName("Product A");

        when(productModelService.createProductModel(any())).thenReturn(productModel);

        mockMvc.perform(post("/api/product-models")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"Product A\", \"brand\": \"Brand A\", \"price\": 100.0}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Product A"));
    }
}
