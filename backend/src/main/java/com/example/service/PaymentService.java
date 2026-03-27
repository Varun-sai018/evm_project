package com.example.service;

import com.example.model.Booking;
import com.example.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking processPayment(Long bookingId, String paymentDetails) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            
            if (Boolean.TRUE.equals(booking.getIsPaid()) || "CONFIRMED".equals(booking.getStatus())) {
                throw new RuntimeException("Booking is already paid and confirmed");
            }
            
            // Simulate payment processing here
            // e.g., contacting Stripe, validating paymentDetails, etc.
            boolean paymentSuccess = true;
            
            if (paymentSuccess) {
                booking.setIsPaid(true);
                booking.setStatus("CONFIRMED");
                return bookingRepository.save(booking);
            } else {
                throw new RuntimeException("Payment simulation failed");
            }
        }
        
        throw new RuntimeException("Booking not found");
    }
}
