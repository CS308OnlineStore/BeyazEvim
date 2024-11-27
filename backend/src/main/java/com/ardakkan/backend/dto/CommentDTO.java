package com.ardakkan.backend.dto;
public class CommentDTO {
    private Long id;                // Yorumun ID'si
    private String title;           // Yorum başlığı
    private Integer rating;         // Yorum puanı (1-5 arasında)
    private String text;            // Yorum metni
    private String userName;        // Yorumu yapan kullanıcının adı
    private Boolean approved;       // Yorumun onay durumu
    private Long productId;         // Yorumun ait olduğu ürün ID'si
    private String productName;     // Yorumun ait olduğu ürün adı

    // Constructor
    public CommentDTO(Long id, String title, Integer rating, String text, String userName, Boolean approved, Long productId, String productName) {
        this.id = id;
        this.title = title;
        this.rating = rating;
        this.text = text;
        this.userName = userName;
        this.approved = approved;
        this.productId = productId;
        this.productName = productName;
    }

    // Getter ve Setter'lar
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Boolean getApproved() {
        return approved;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }
}
