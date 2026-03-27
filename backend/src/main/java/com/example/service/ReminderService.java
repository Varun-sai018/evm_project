package com.example.service;

import com.example.model.Booking;
import com.example.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EmailService emailService;

    @Scheduled(cron = "0 0 0 * * ?")
    public void sendDailyReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime twentyFourHoursLater = now.plusDays(1);
        
        List<Booking> upcomingBookings = bookingRepository.findByStatusAndEvent_StartTimeBetween(
            "CONFIRMED", 
            now, 
            twentyFourHoursLater
        );
        
        for (Booking booking : upcomingBookings) {
            try {
                emailService.sendEventReminder(
                    booking.getUser().getEmail(),
                    booking.getUser().getName(),
                    booking.getEvent()
                );
            } catch (Exception e) {
                // Log and continue to prevent one failing email from breaking the entire loop
                System.err.println("Failed to send reminder email to " + booking.getUser().getEmail());
                e.printStackTrace();
            }
        }
    }
}
