package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import com.example.model.Event;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;

    public void sendWelcomeEmail(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Welcome to Our App");
        message.setText("Hello " + name + ",\n\nWelcome to our Event Management App!\nWe're glad to have you on board.");

        mailSender.send(message);
    }

    public void sendEventReminder(String toEmail, String name, Event event) {
        SimpleMailMessage message = new SimpleMailMessage();
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
}
