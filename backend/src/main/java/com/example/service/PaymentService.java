package com.example.service;

import com.example.model.Booking;
import com.example.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking processPayment(Long bookingId, Double amount) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if ("CANCELLED".equals(booking.getStatus())) {
            throw new RuntimeException("Cannot pay for a cancelled booking");
        }

        if (booking.getIsPaid() != null && booking.getIsPaid()) {
            throw new RuntimeException("Booking is already paid");
        }

        booking.setAmount(amount);
        booking.setIsPaid(true);
        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }

    public Map<String, Object> getPaymentStatus(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Map<String, Object> statusResponse = new HashMap<>();
        statusResponse.put("bookingId", booking.getId());
        statusResponse.put("isPaid", booking.getIsPaid());
        statusResponse.put("status", booking.getStatus());
        statusResponse.put("amount", booking.getAmount());

        return statusResponse;
    }
}
