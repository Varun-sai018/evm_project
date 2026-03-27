package com.example.service;

import com.example.model.Booking;
import com.example.model.Event;
import com.example.repository.BookingRepository;
import com.example.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Map<String, Object> getEventAnalytics(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        List<Booking> bookings = bookingRepository.findByEvent(event);

        long totalBookings = bookings.size();
        long confirmedBookings = bookings.stream().filter(b -> "CONFIRMED".equals(b.getStatus())).count();
        long cancelledBookings = bookings.stream().filter(b -> "CANCELLED".equals(b.getStatus())).count();
        long pendingBookings = bookings.stream().filter(b -> "PENDING".equals(b.getStatus())).count();
        double totalRevenue = bookings.stream()
                .filter(b -> b.getIsPaid() != null && b.getIsPaid())
                .mapToDouble(b -> b.getAmount() != null ? b.getAmount() : 0.0)
                .sum();
                
        double attendanceRate = totalBookings > 0 ? ((double) confirmedBookings / totalBookings) * 100.0 : 0.0;

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("eventId", event.getId());
        analytics.put("eventTitle", event.getTitle());
        analytics.put("totalBookings", totalBookings);
        analytics.put("confirmedBookings", confirmedBookings);
        analytics.put("cancelledBookings", cancelledBookings);
        analytics.put("pendingBookings", pendingBookings);
        analytics.put("totalRevenue", totalRevenue);
        analytics.put("attendanceRate", Math.round(attendanceRate * 100.0) / 100.0);

        return analytics;
    }

    public Map<String, Object> getDashboardSummary() {
        List<Event> allEvents = eventRepository.findAll();
        List<Booking> allBookings = bookingRepository.findAll();

        long totalEvents = allEvents.size();
        long totalBookings = allBookings.size();
        double totalRevenue = allBookings.stream()
                .filter(b -> b.getIsPaid() != null && b.getIsPaid())
                .mapToDouble(b -> b.getAmount() != null ? b.getAmount() : 0.0)
                .sum();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalEvents", totalEvents);
        summary.put("totalBookings", totalBookings);
        summary.put("totalRevenue", totalRevenue);

        return summary;
    }
}
