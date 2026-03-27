package com.example.controller;

import com.example.model.Booking;
import com.example.model.Event;
import com.example.repository.BookingRepository;
import com.example.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin
public class AnalyticsController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    @GetMapping("/event/{eventId}")
    public ResponseEntity<Map<String, Object>> getEventAnalytics(@PathVariable Long eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Booking> bookings = bookingRepository.findByEvent(eventOpt.get());

        long totalBookings = bookings.stream().filter(b -> !"CANCELLED".equals(b.getStatus())).count();
        long cancellationCount = bookings.stream().filter(b -> "CANCELLED".equals(b.getStatus())).count();
        
        double totalRevenue = bookings.stream()
                .filter(b -> !"CANCELLED".equals(b.getStatus()) && Boolean.TRUE.equals(b.getIsPaid()))
                .mapToDouble(b -> b.getAmount() != null ? b.getAmount() : 0.0)
                .sum();

        long confirmed = bookings.stream().filter(b -> "CONFIRMED".equals(b.getStatus())).count();
        double attendanceRate = totalBookings > 0 ? ((double) confirmed / totalBookings) * 100 : 0.0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBookings", totalBookings);
        stats.put("totalRevenue", totalRevenue);
        stats.put("cancellationCount", cancellationCount);
        stats.put("attendanceRate", attendanceRate);

        return ResponseEntity.ok(stats);
    }
}
