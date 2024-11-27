package com.ardakkan.backend.controller;

import com.ardakkan.backend.dto.CommentDTO;
import com.ardakkan.backend.entity.Comment;
import com.ardakkan.backend.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

   
    // Yeni bir yorum ekle
    @PostMapping("/users/{userId}/products/{productModelId}")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable Long userId, 
            @PathVariable Long productModelId, 
            @RequestBody Comment comment) {
        // Rating doğrulaması
        if (comment.getRating() < 1 || comment.getRating() > 5) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        CommentDTO savedComment = commentService.addComment(userId, productModelId, comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
    }

    // Tüm yorumları getir
    @GetMapping
    public ResponseEntity<List<CommentDTO>> getAllComments() {
        List<CommentDTO> comments = commentService.getAllComments();
        return ResponseEntity.ok(comments);
    }

    // Belirli bir yorum ID'sine göre getir
    @GetMapping("/{commentId}")
    public ResponseEntity<CommentDTO> getCommentById(@PathVariable Long commentId) {
        CommentDTO commentDTO = commentService.getCommentDTOById(commentId);
        return ResponseEntity.ok(commentDTO);
    }


    // Belirli bir kullanıcıya ait yorumları getir
    @GetMapping("/users/{userId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByUser(@PathVariable Long userId) {
        List<CommentDTO> comments = commentService.getCommentsByUser(userId);
        return ResponseEntity.ok(comments);
    }

    // Belirli bir ürün modeline ait yorumları getir
    @GetMapping("/products/{productModelId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByProductModel(@PathVariable Long productModelId) {
        List<CommentDTO> comments = commentService.getCommentsByProductModel(productModelId);
        return ResponseEntity.ok(comments);
    }

    // Yorum güncelle
    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long commentId,
            @RequestBody Comment updatedComment) {
        CommentDTO updated = commentService.updateComment(commentId, updatedComment);
        return ResponseEntity.ok(updated);
    }

    // Yorum onayla veya onayı kaldır
    @PatchMapping("/{commentId}/approve")
    public ResponseEntity<CommentDTO> approveComment(
            @PathVariable Long commentId, 
            @RequestParam boolean isApproved) {
        CommentDTO approvedComment = commentService.approveComment(commentId, isApproved);
        return ResponseEntity.ok(approvedComment);
    }


    // Yorum sil
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    // Ürün popülerlik hesaplama
    @GetMapping("/products/{productModelId}/popularity")
    public ResponseEntity<Double> getProductPopularity(@PathVariable Long productModelId) {
        try {
            double popularity = commentService.calculatePopularity(productModelId);
            return ResponseEntity.ok(popularity);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
