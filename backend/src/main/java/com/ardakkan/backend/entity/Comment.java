package com.ardakkan.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "Comment")  // Veritabanındaki tablo adı
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 45)
    @Size(max = 45, message = "Title can be up to 45 characters")
    private String title;  // Şemadaki "Commentcol" alanı

    @Column(nullable = false)
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;  // 1-5 arasında puanlama

    @Column(nullable = false, length = 245)
    @Size(max = 245, message = "Comment text can be up to 245 characters")
    private String text;

    @Column(nullable = false)
    private Boolean approved = false;

    // Many-to-One ilişki: Bir yorum bir kullanıcıya aittir
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)  // Veritabanındaki foreign key alanı
    private User user;

    // Many-to-One ilişki: Bir yorum bir ürün modeline aittir
    @ManyToOne
    @JoinColumn(name = "productModel_id", nullable = false)  // Veritabanındaki foreign key alanı
    private ProductModel productModel;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }


    // Getter ve Setter'lar

    
    public Long getId() {
        return id;
    }

    public void setId(Long idComment) {
        this.id = idComment;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Boolean getApproved() {
        return approved;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ProductModel getProductModel() {
        return productModel;
    }

    public void setProductModel(ProductModel productModel) {
        this.productModel = productModel;
    }
    

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}

