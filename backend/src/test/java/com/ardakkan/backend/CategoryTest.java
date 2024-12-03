package com.ardakkan.backend;

import com.ardakkan.backend.dto.CategoryProductsDTO;
import com.ardakkan.backend.entity.Category;
import com.ardakkan.backend.entity.ProductModel;
import com.ardakkan.backend.repo.CategoryRepository;
import com.ardakkan.backend.repo.ProductModelRepository;
import com.ardakkan.backend.service.CategoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductModelRepository productModelRepository;

    @InjectMocks
    private CategoryService categoryService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddCategory() {
        // Arrange
        Category parentCategory = new Category();
        parentCategory.setId(1L);
        parentCategory.setSubCategories(new ArrayList<>());

        Category newCategory = new Category();
        newCategory.setParentCategory(parentCategory);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(parentCategory));
        when(categoryRepository.save(any(Category.class))).thenReturn(newCategory);

        // Act
        Category result = categoryService.addCategory(newCategory);

        // Assert
        assertEquals(parentCategory, result.getParentCategory());
        verify(categoryRepository, times(2)).save(any(Category.class));
    }

    @Test
    void testGetSubCategories() {
        // Arrange
        Category parentCategory = new Category();
        parentCategory.setId(1L);

        Category subCategory = new Category();
        subCategory.setId(2L);

        parentCategory.setSubCategories(List.of(subCategory));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(parentCategory));

        // Act
        List<Category> subCategories = categoryService.getSubCategories(1L);

        // Assert
        assertEquals(1, subCategories.size());
        assertEquals(2L, subCategories.get(0).getId());
        verify(categoryRepository, times(1)).findById(1L);
    }

    @Test
    void testUpdateCategory() {
        // Arrange
        Category existingCategory = new Category();
        existingCategory.setId(1L);
        existingCategory.setCategoryName("Old Name");

        Category updatedCategory = new Category();
        updatedCategory.setCategoryName("New Name");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(existingCategory));
        when(categoryRepository.save(existingCategory)).thenReturn(existingCategory);

        // Act
        Category result = categoryService.updateCategory(1L, updatedCategory);

        // Assert
        assertEquals("New Name", result.getCategoryName());
        verify(categoryRepository, times(1)).findById(1L);
        verify(categoryRepository, times(1)).save(existingCategory);
    }

    @Test
    void testGetProductModelsAndBrandsByCategory() {
        // Arrange
        Category category = new Category();
        category.setId(1L);
        category.setParentCategory(null); // Root category

        ProductModel product1 = new ProductModel();
        product1.setDistributorInformation("BrandA");
        ProductModel product2 = new ProductModel();
        product2.setDistributorInformation("BrandB");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productModelRepository.findByCategoryId(1L)).thenReturn(List.of(product1, product2));

        // Act
        CategoryProductsDTO result = categoryService.getProductModelsAndBrandsByCategory(1L);

        // Assert
        assertEquals(2, result.getProductModels().size());
        assertEquals(2, result.getBrands().size());
        assertTrue(result.getBrands().contains("BrandA"));
        assertTrue(result.getBrands().contains("BrandB"));
        verify(categoryRepository, times(1)).findById(1L);
        verify(productModelRepository, times(1)).findByCategoryId(1L);
    }
}
