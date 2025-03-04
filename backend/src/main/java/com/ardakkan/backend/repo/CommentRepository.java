package com.ardakkan.backend.repo;

import com.ardakkan.backend.entity.Comment;
import com.ardakkan.backend.entity.ProductModel;
import com.ardakkan.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Belirli bir ürün modeline ait yorumları bulmak
    List<Comment> findByProductModel(ProductModel productModel);

    // Belirli bir kullanıcıya ait yorumları bulmak
    List<Comment> findByUser(User user);

    List<Comment> findByUserAndProductModel(User user, ProductModel productModel);
    
    List<Comment> findByApproved(boolean approved);
    // Belirli bir ürün modeline ait ve onaylanmış yorumları bulma
    List<Comment> findByProductModelAndApproved(ProductModel productModel, Boolean approved);
}