package com.ardakkan.backend.service;

import com.ardakkan.backend.entity.Comment;
import com.ardakkan.backend.entity.ProductModel;
import com.ardakkan.backend.entity.User;
import com.ardakkan.backend.repo.CommentRepository;
import com.ardakkan.backend.repo.ProductModelRepository;
import com.ardakkan.backend.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ardakkan.backend.dto.CommentDTO;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final ProductModelRepository productModelRepository;
    private final UserRepository userRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository, ProductModelRepository productModelRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.productModelRepository = productModelRepository;
        this.userRepository = userRepository;
    }

    // Yeni bir yorum ekle
    public CommentDTO addComment(Long userId, Long productModelId, Comment comment) {
        // Kullanıcıyı kontrol et
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Ürün modelini kontrol et
        ProductModel productModel = productModelRepository.findById(productModelId)
                .orElseThrow(() -> new RuntimeException("ProductModel not found with id: " + productModelId));

        // Aynı kullanıcı ve ürün için daha önce yorum bırakılmış mı kontrol et
        if (!commentRepository.findByUserAndProductModel(user, productModel).isEmpty()) {
            throw new RuntimeException("User has already rated this product.");
        }

        // Yeni yorum ekleme işlemi
        comment.setUser(user);
        comment.setProductModel(productModel);
        comment.setApproved(false); // İlk başta onaysız olabilir
        Comment savedComment = commentRepository.save(comment);

        return convertToDTO(savedComment);
    }

    // Tüm yorumları getir
    public List<CommentDTO> getAllComments() {
        List<Comment> comments = commentRepository.findAll();
        return comments.stream()
                .map(this::convertToDTO)
                .toList();
    }

    // Belirli bir yorum ID'sine göre DTO getir
    public CommentDTO getCommentDTOById(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));
        return convertToDTO(comment);
    }

    // Belirli bir kullanıcıya ait yorumları getir
    public List<CommentDTO> getCommentsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        List<Comment> comments = commentRepository.findByUser(user);
        return comments.stream()
                .map(this::convertToDTO)
                .toList();
    }

    // Belirli bir ürün modeline ait yorumları DTO olarak getir
    public List<CommentDTO> getCommentsByProductModel(Long productModelId) {
        ProductModel productModel = productModelRepository.findById(productModelId)
                .orElseThrow(() -> new RuntimeException("ProductModel not found with id: " + productModelId));
        List<Comment> comments = commentRepository.findByProductModel(productModel);
        return comments.stream()
                .map(this::convertToDTO)
                .toList();
    }

    // Yorum güncelle
    public CommentDTO updateComment(Long commentId, Comment updatedComment) {
        Comment existingComment = getCommentById(commentId);
        existingComment.setTitle(updatedComment.getTitle());
        existingComment.setText(updatedComment.getText());
        existingComment.setRating(updatedComment.getRating());
        Comment savedComment = commentRepository.save(existingComment);
        return convertToDTO(savedComment); // DTO'ya dönüştürerek döndür
    }


    // Yorum onayla veya onayı kaldır
    public CommentDTO approveComment(Long commentId, boolean isApproved) {
        Comment comment = getCommentById(commentId); // Yorum var mı kontrol et
        comment.setApproved(isApproved); // Onay durumunu güncelle
        Comment savedComment = commentRepository.save(comment); // Yorum kaydediliyor
        return convertToDTO(savedComment); // DTO'ya dönüştür ve döndür
    }


    // Yorum sil
    public void deleteComment(Long commentId) {
        Comment comment = getCommentById(commentId);
        commentRepository.delete(comment);
    }

    // Popülerlik hesapla
    public double calculatePopularity(Long productModelId) {
        // Ürün modelini al
        ProductModel productModel = productModelRepository.findById(productModelId)
                .orElseThrow(() -> new RuntimeException("ProductModel not found with id: " + productModelId));

        // Ürüne ait yorumları al
        List<Comment> comments = commentRepository.findByProductModel(productModel);

        if (comments.isEmpty()) {
            return 0.0; // Yorum yoksa popülerlik sıfırdır
        }

        // Ortalama rating'i hesapla
        double averageRating = comments.stream()
                .mapToInt(Comment::getRating)
                .average()
                .orElse(0.0);

        // Yorum sayısını al ve logaritmik ağırlık uygula
        int totalComments = comments.size();
        return averageRating + Math.log(totalComments + 1); // Ağırlık eklenmiş popülerlik skoru
    }

    // Yorumdan DTO'ya dönüştürme işlemi
    public CommentDTO convertToDTO(Comment comment) {
        return new CommentDTO(
                comment.getId(),
                comment.getTitle(),
                comment.getRating(),
                comment.getText(),
                comment.getUser().getEmail(), // Kullanıcının e-posta adresini almak için
                comment.getApproved(),
                comment.getProductModel().getId(),
                comment.getProductModel().getName() // Ürün adını al
        );
    }

    // Belirli bir yorum ID'sine göre getir
    public Comment getCommentById(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));
    }
}
