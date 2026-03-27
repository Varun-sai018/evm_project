package com.example.controller;

import com.example.model.Booking;
import com.example.dto.BookingDTO;
import com.example.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingDTO> bookEvent(@RequestBody Map<String, Long> payload) {
        Long userId = payload.get("userId");
        Long eventId = payload.get("eventId");
        
        try {
            Booking booking = bookingService.bookEvent(userId, eventId);
            return ResponseEntity.ok(new BookingDTO(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelBooking(@PathVariable Long id) {
        try {
            bookingService.cancelBooking(id);
            return ResponseEntity.ok("Booking cancelled successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingDTO>> getUserBookings(@PathVariable Long userId) {
        try {
            List<BookingDTO> bookings = bookingService.getUserBookings(userId).stream()
                .map(BookingDTO::new).collect(Collectors.toList());
            return ResponseEntity.ok(bookings);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<BookingDTO>> getEventAttendees(@PathVariable Long eventId) {
        try {
            List<BookingDTO> attendees = bookingService.getEventAttendees(eventId).stream()
                .map(BookingDTO::new).collect(Collectors.toList());
            return ResponseEntity.ok(attendees);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
