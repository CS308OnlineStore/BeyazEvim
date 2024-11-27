package com.ardakkan.backend.repo;

import com.ardakkan.backend.entity.Comment;
import com.ardakkan.backend.entity.ProductModel;
import com.ardakkan.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Belirli bir ürün modeline ait yorumları bulmak
    List<Comment> findByProductModel(ProductModel productModel);

    // Belirli bir kullanıcıya ait yorumları bulmak
    List<Comment> findByUser(User user);

    // Belirli bir ürüne ait onaylanmış yorumları bulmak
    List<Comment> findByProductModelAndApprovedTrue(ProductModel productModel);

    // Onay bekleyen tüm yorumları bulmak
    List<Comment> findByApprovedFalse();

    // Belirli bir kullanıcı ve ürün için yorumları bulmak
    List<Comment> findByUserAndProductModel(User user, ProductModel productModel);

    // Ortalama rating'i hesapla
    @Query("SELECT AVG(c.rating) FROM Comment c WHERE c.productModel = :productModel")
    Double findAverageRatingByProductModel(@Param("productModel") ProductModel productModel);

    // Yorum sayısını bul
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.productModel = :productModel")
    Long findCommentCountByProductModel(@Param("productModel") ProductModel productModel);

    // Onaylanmış yorumların sayısını bul (Opsiyonel)
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.productModel = :productModel AND c.approved = true")
    Long findApprovedCommentCountByProductModel(@Param("productModel") ProductModel productModel);
}
