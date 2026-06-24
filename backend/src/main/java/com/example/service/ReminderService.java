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

    // Temporary fixed delay for testing: runs every 30 seconds
    @Scheduled(fixedDelay = 30000)
    public void sendEventReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime next24Hours = now.plusDays(1);

        List<Booking> upcomingBookings = bookingRepository.findByStatusAndEvent_StartTimeBetween(
                "CONFIRMED", now, next24Hours);

        for (Booking booking : upcomingBookings) {
            String toEmail = booking.getUser().getEmail();
            String subject = "Reminder: Your event starts tomorrow!";
            String body = String.format(
                    "Hello %s,\n\nThis is a friendly reminder that your event '%s' is starting soon!\n\nDate & Time: %s\nLocation: %s\n\nWe look forward to seeing you there!",
                    booking.getUser().getName(),
                    booking.getEvent().getTitle(),
                    booking.getEvent().getStartTime().toString(),
                    booking.getEvent().getLocation() != null ? booking.getEvent().getLocation() : "TBD"
            );

            try {
                emailService.sendEmail(toEmail, subject, body);
                System.out.println(">>> [REMINDER Cron] Sent reminder email to: " + toEmail + " for event: " + booking.getEvent().getTitle());
            } catch (Exception e) {
                System.err.println(">>> [REMINDER Cron] Failed to send reminder to " + toEmail + ": " + e.getMessage());
            }
        }
    }
}
