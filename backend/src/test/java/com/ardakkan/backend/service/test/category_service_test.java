package com.ardakkan.backend.service.test;

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
import java.util.Arrays;
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

    private Category category;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Örnek bir kategori oluştur
        category = new Category();
        category.setId(1L);
        category.setCategoryName("Electronics");
        category.setActive(true);
    }

    // 1. addCategory() test
    @Test
    void shouldAddCategory() {
        when(categoryRepository.save(category)).thenReturn(category);

        Category savedCategory = categoryService.addCategory(category);

        assertNotNull(savedCategory);
        assertEquals("Electronics", savedCategory.getCategoryName());
        verify(categoryRepository, times(1)).save(category);
    }

    // 2. getCategoryById() test
    @Test
    void shouldGetCategoryById() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        Category foundCategory = categoryService.getCategoryById(1L);

        assertNotNull(foundCategory);
        assertEquals(1L, foundCategory.getId());
        verify(categoryRepository, times(1)).findById(1L);
    }

    // 3. getAllCategories() test
    @Test
    void shouldGetAllCategories() {
        List<Category> categories = Arrays.asList(category);
        when(categoryRepository.findAllByIsActiveTrue()).thenReturn(categories);

        List<Category> result = categoryService.getAllCategories();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(categoryRepository, times(1)).findAllByIsActiveTrue();
    }

    // 4. updateCategory() test
    @Test
    void shouldUpdateCategory() {
        Category updatedCategory = new Category();
        updatedCategory.setCategoryName("Updated Electronics");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.save(category)).thenReturn(category);

        Category result = categoryService.updateCategory(1L, updatedCategory);

        assertNotNull(result);
        assertEquals("Updated Electronics", result.getCategoryName());
        verify(categoryRepository, times(1)).save(category);
    }

    // 5. deleteCategory() test
    @Test
    void shouldDeleteCategory() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        categoryService.deleteCategory(1L);

        verify(categoryRepository, times(1)).delete(category);
    }

    // 6. getSubCategories() test
    @Test
    void shouldGetSubCategories() {
        Category subCategory = new Category();
        subCategory.setId(2L);
        subCategory.setCategoryName("Laptops");
        subCategory.setActive(true);

        category.setSubCategories(List.of(subCategory));

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        List<Category> subCategories = categoryService.getSubCategories(1L);

        assertNotNull(subCategories);
        assertEquals(1, subCategories.size());
        assertEquals("Laptops", subCategories.get(0).getCategoryName());
    }

    // 7. getProductModelsByCategory() test
    @Test
    void shouldGetProductModelsByCategory() {
        ProductModel productModel = new ProductModel();
        productModel.setId(1L);
        productModel.setName("Laptop");

        when(productModelRepository.findByCategoryId(1L)).thenReturn(List.of(productModel));

        List<ProductModel> productModels = categoryService.getProductModelsByCategory(1L);

        assertNotNull(productModels);
        assertEquals(1, productModels.size());
        assertEquals("Laptop", productModels.get(0).getName());
    }

   
}
