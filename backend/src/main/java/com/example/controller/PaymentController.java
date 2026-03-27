package com.example.controller;

import com.example.model.Booking;
import com.example.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> payload) {
        try {
            Long bookingId = Long.valueOf(payload.get("bookingId").toString());
            Double amount = Double.valueOf(payload.get("amount").toString());
            
            Booking updatedBooking = paymentService.processPayment(bookingId, amount);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Payment processed successfully");
            response.put("bookingId", updatedBooking.getId());
            response.put("status", updatedBooking.getStatus());
            response.put("isPaid", updatedBooking.getIsPaid());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Long bookingId) {
        try {
            Map<String, Object> status = paymentService.getPaymentStatus(bookingId);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
