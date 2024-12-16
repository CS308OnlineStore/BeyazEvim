package com.ardakkan.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ardakkan.backend.entity.ProductModel;
import com.ardakkan.backend.entity.User;
import com.ardakkan.backend.repo.ProductModelRepository;
import com.ardakkan.backend.repo.UserRepository;

@Service
public class NotificationService {

    @Autowired
    private MailService mailService;

    @Autowired
    private UserRepository userRepository; // Kullanıcıları getirmek için
    
    @Autowired
    private ProductModelRepository productModelRepository; // Ürünleri getirmek için

    
    public void notifyUsersAboutDiscount(Long productId) {
        // Ürünü veritabanından bul
        ProductModel product = productModelRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        // Ürünü wishlist'ine ekleyen kullanıcıları bul
        List<User> usersWithProductInWishlist = userRepository.findAllByWishlistContaining(product);

        // Kullanıcılara mail gönder
        for (User user : usersWithProductInWishlist) {
            String subject = "Great News! " + product.getName() + " is now on discount!";
            String text = "Dear " + user.getFirstName() + ",\n\n" +
                    "The product '" + product.getName() + "' is now on discount!\n" +
                    "Check it out now and don't miss this great opportunity.\n\n" +
                    "Best regards,\nYour Shopping Team";

            mailService.sendSimpleMail(user.getEmail(), subject, text);
        }
    }
    
    public void notifyUsersForRestock(ProductModel product) {
        List<User> usersWithWishlist = userRepository.findUsersByWishlistProduct(product.getId());

        for (User user : usersWithWishlist) {
            String subject = "Product Back in Stock!";
            String message = "Dear " + user.getFirstName() + ",\n\n"
                    + "The product \"" + product.getName() + "\" is now back in stock! Don't miss your chance to purchase it.\n\n"
                    + "Best regards,\nThe Beyaz Evim Team";

            mailService.sendSimpleMail(user.getEmail(), subject, message);
        }
    }
    
    public void notifyOrderCancellation(String userEmail, String firstName, Long orderId) {
        String subject = "Your Order #" + orderId + " Has Been Canceled";
        String text = "Dear " + firstName + ",\n\n" +
                      "Your order with ID #" + orderId + " has been successfully canceled.\n" +
                      "The refund process will be completed within 5-10 business days.\n\n" +
                      "Thank you for your understanding.\n\n" +
                      "Best regards,\n" +
                      "Beyaz Evim Team";

        mailService.sendSimpleMail(userEmail, subject, text);
    }

}
