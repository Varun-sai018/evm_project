package com.example.controller;

import com.example.model.Booking;
import com.example.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> payload) {
        try {
            // Using Object and casting safely
            Object bookingIdObj = payload.get("bookingId");
            Long bookingId = null;
            if (bookingIdObj instanceof Number) {
                bookingId = ((Number) bookingIdObj).longValue();
            } else if (bookingIdObj instanceof String) {
                bookingId = Long.parseLong((String) bookingIdObj);
            }
            
            String paymentDetails = (String) payload.get("paymentDetails");
            
            if (bookingId == null || paymentDetails == null) {
                return ResponseEntity.badRequest().body("Invalid payment payload");
            }

            Booking confirmedBooking = paymentService.processPayment(bookingId, paymentDetails);
            return ResponseEntity.ok(confirmedBooking);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
