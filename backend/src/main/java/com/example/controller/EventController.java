package com.example.controller;

import com.example.model.Event;
import com.example.repository.EventRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.example.repository.BookingRepository;
import com.example.model.Booking;

@RestController
@RequestMapping("/api/events")
@CrossOrigin
public class EventController {

    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;

    public EventController(EventRepository eventRepository, BookingRepository bookingRepository) {
        this.eventRepository = eventRepository;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping
    public Page<Event> getAllEvents(
            @RequestParam(required = false) Long organizerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "200") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Event> events;
        if (organizerId != null) {
            events = eventRepository.findByOrganizerId(organizerId, pageable);
        } else {
            events = eventRepository.findByStatus(com.example.model.EventStatus.APPROVED, pageable);
        }
        events.forEach(event -> {
            long activeBookings = bookingRepository.findByEvent(event).stream()
                .filter(b -> !"CANCELLED".equals(b.getStatus()))
                .count();
            event.setBookedCount((int) activeBookings);
        });
        return events;
    }

    @PostMapping
    public Event createEvent(@Valid @RequestBody Event event) {
        return eventRepository.save(event);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @Valid @RequestBody Event eventDetails) {
        return eventRepository.findById(id)
                .map(event -> {
                    event.setTitle(eventDetails.getTitle());
                    event.setDescription(eventDetails.getDescription());
                    event.setStartTime(eventDetails.getStartTime());
                    event.setEndTime(eventDetails.getEndTime());
                    event.setTicketPrice(eventDetails.getTicketPrice());
                    event.setLocation(eventDetails.getLocation());
                    event.setCapacity(eventDetails.getCapacity());
                    // we do not overwrite organizerId here
                    return ResponseEntity.ok(eventRepository.save(event));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteEvent(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(event -> {
                    eventRepository.delete(event);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
