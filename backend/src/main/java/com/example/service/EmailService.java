package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import com.example.model.Event;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public void sendWelcomeEmail(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Welcome to Our App");
        message.setText("Hello " + name + ",\n\nWelcome to our Event Management App!\nWe're glad to have you on board.");

        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                mailSender.send(message);
            } catch (Exception e) {
                System.err.println("Failed to send async welcome email: " + e.getMessage());
            }
        });
    }

    public void sendEventReminder(String toEmail, String name, Event event) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Reminder: Upcoming Event - " + event.getTitle());
        
        String locationStr = event.getLocation() != null ? event.getLocation() : "Online / To Be Announced";
        
        message.setText("Hello " + name + ",\n\n"
                + "This is a reminder for your upcoming event tomorrow!\n\n"
                + "Event: " + event.getTitle() + "\n"
                + "Date & Time: " + event.getStartTime() + " to " + event.getEndTime() + "\n"
                + "Location: " + locationStr + "\n\n"
                + "We look forward to seeing you there!");

        mailSender.send(message);
    }

    public void sendBookingConfirmation(String toEmail, String name, Event event, String bookingReference) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Reservation Confirmed: " + event.getTitle());
        
        String locationStr = event.getLocation() != null ? event.getLocation() : "Online / To Be Announced";
        
        message.setText("Hello " + name + ",\n\n"
                + "Your ticket has been successfully reserved!\n\n"
                + "Event: " + event.getTitle() + "\n"
                + "Date & Time: " + event.getStartTime() + " to " + event.getEndTime() + "\n"
                + "Location: " + locationStr + "\n\n"
                + "Booking Reference: " + bookingReference + "\n\n"
                + "Please show this reference or your QR code at the venue to pay cash and claim your pass.\n"
                + "We look forward to seeing you there!");

        mailSender.send(message);
    }

    public void sendCancellationNotice(String toEmail, String name, Event event) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Reservation Cancelled: " + event.getTitle());
        
        message.setText("Hello " + name + ",\n\n"
                + "Your reservation for '" + event.getTitle() + "' has been successfully cancelled.\n\n"
                + "If this was a mistake, you can always reserve a new ticket from the dashboard, provided tickets are still available.\n\n"
                + "Thank you,\nEventHub Team");

        mailSender.send(message);
    }
}
