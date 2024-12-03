package com.ardakkan.backend;

import com.ardakkan.backend.service.MailService;
import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.Mockito.*;

class MailTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private MailService mailService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSendSimpleMail() {
        // Arrange
        String to = "test@example.com";
        String subject = "Test Subject";
        String text = "Test email body";
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        // Act
        mailService.sendSimpleMail(to, subject, text);

        // Assert
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testSendMailWithAttachment() throws MessagingException {
        // Arrange
        String to = "test@example.com";
        String subject = "Test Subject with Attachment";
        String text = "Please find the attachment.";
        String attachmentName = "test.pdf";
        byte[] attachmentData = "Test PDF Content".getBytes();

        MimeMessage mimeMessage = new MimeMessage((Session) null);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        // Act
        MailService.sendMailWithAttachment(to, subject, text, attachmentName, attachmentData);

        // Assert
        verify(mailSender, times(1)).send(mimeMessage);
    }
}
