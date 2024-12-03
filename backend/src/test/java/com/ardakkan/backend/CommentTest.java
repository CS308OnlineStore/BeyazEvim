package com.ardakkan.backend;

import com.ardakkan.backend.entity.Comment;
import com.ardakkan.backend.entity.ProductModel;
import com.ardakkan.backend.entity.User;
import com.ardakkan.backend.repo.CommentRepository;
import com.ardakkan.backend.repo.ProductModelRepository;
import com.ardakkan.backend.repo.UserRepository;
import com.ardakkan.backend.service.CommentService;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private ProductModelRepository productModelRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CommentService commentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addComment_ShouldSaveAndReturnComment_WhenValidRequest() {
        // Arrange
        Long userId = 1L;
        Long productModelId = 1L;
        String title = "Great Product";
        Integer rating = 5;
        String text = "I loved it!";

        User mockUser = new User();
        mockUser.setId(userId);

        ProductModel mockProductModel = new ProductModel();
        mockProductModel.setId(productModelId);

        Comment mockComment = new Comment();
        mockComment.setTitle(title);
        mockComment.setRating(rating);
        mockComment.setText(text);
        mockComment.setCreatedDate(LocalDateTime.now());
        mockComment.setUser(mockUser);
        mockComment.setProductModel(mockProductModel);

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(productModelRepository.findById(productModelId)).thenReturn(Optional.of(mockProductModel));
        when(commentRepository.findByUserAndProductModel(mockUser, mockProductModel)).thenReturn(new ArrayList<>());
        when(commentRepository.save(any(Comment.class))).thenReturn(mockComment);

        // Act
        Comment savedComment = commentService.addComment(userId, productModelId, title, rating, text);

        // Assert
        assertNotNull(savedComment);
        assertEquals(title, savedComment.getTitle());
        assertEquals(rating, savedComment.getRating());
        assertEquals(text, savedComment.getText());
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    
    @Test
    void deleteComment_ShouldDeleteComment_WhenValidId() {
        // Arrange
        Long commentId = 1L;
        Comment mockComment = new Comment();
        mockComment.setId(commentId);

        when(commentRepository.findById(commentId)).thenReturn(Optional.of(mockComment));
        doNothing().when(commentRepository).delete(mockComment);

        // Act
        commentService.deleteComment(commentId);

        // Assert
        verify(commentRepository, times(1)).delete(mockComment);
    }

    @Test
    void updateComment_ShouldUpdateAndReturnComment_WhenValidId() {
        // Arrange
        Long commentId = 1L;
        Comment existingComment = new Comment();
        existingComment.setId(commentId);
        existingComment.setTitle("Old Title");
        existingComment.setText("Old Text");

        Comment updatedComment = new Comment();
        updatedComment.setTitle("New Title");
        updatedComment.setText("New Text");

        when(commentRepository.findById(commentId)).thenReturn(Optional.of(existingComment));
        when(commentRepository.save(existingComment)).thenReturn(updatedComment);

        // Act
        Comment result = commentService.updateComment(commentId, updatedComment);

        // Assert
        assertNotNull(result);
        assertEquals("New Title", result.getTitle());
        assertEquals("New Text", result.getText());
        verify(commentRepository, times(1)).save(existingComment);
    }

    @Test
    void getCommentsByUser_ShouldReturnComments_WhenValidUserId() {
        // Arrange
        Long userId = 1L;
        User mockUser = new User();
        mockUser.setId(userId);

        List<Comment> mockComments = List.of(new Comment(), new Comment());

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(commentRepository.findByUser(mockUser)).thenReturn(mockComments);

        // Act
        List<Comment> result = commentService.getCommentsByUser(userId);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(commentRepository, times(1)).findByUser(mockUser);
    }

    @Test
    void calculatePopularity_ShouldReturnCorrectPopularity_WhenCommentsExist() {
        // Arrange
        Long productModelId = 1L;
        ProductModel mockProductModel = new ProductModel();
        mockProductModel.setId(productModelId);

        Comment comment1 = new Comment();
        comment1.setRating(5);
        Comment comment2 = new Comment();
        comment2.setRating(4);

        List<Comment> mockComments = List.of(comment1, comment2);

        when(productModelRepository.findById(productModelId)).thenReturn(Optional.of(mockProductModel));
        when(commentRepository.findByProductModel(mockProductModel)).thenReturn(mockComments);

        // Act
        double result = commentService.calculatePopularity(productModelId);

        // Assert
        assertTrue(result > 0);
        verify(productModelRepository, times(1)).findById(productModelId);
    }
 


}

