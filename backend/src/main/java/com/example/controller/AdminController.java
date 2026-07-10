package com.example.controller;

import com.example.model.Event;
import com.example.model.EventStatus;
import com.example.repository.EventRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/events")
@CrossOrigin
public class AdminController {

    private final EventRepository eventRepository;

    public AdminController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @GetMapping("/pending")
    public Page<Event> getPendingEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "200") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return eventRepository.findByStatus(EventStatus.PENDING, pageable);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Event> approveEvent(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(event -> {
                    if (event.getStatus() == EventStatus.APPROVED) {
                        return ResponseEntity.badRequest().body(event); // Or throw an exception
                    }
                    event.setStatus(EventStatus.APPROVED);
                    event.setRejectionReason(null);
                    return ResponseEntity.ok(eventRepository.save(event));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Event> rejectEvent(@PathVariable Long id, @RequestBody Map<String, String> request) {
        return eventRepository.findById(id)
                .map(event -> {
                    if (event.getStatus() == EventStatus.REJECTED) {
                        return ResponseEntity.badRequest().body(event);
                    }
                    String reason = request.get("reason");
                    if (reason == null || reason.trim().isEmpty()) {
                        throw new IllegalArgumentException("Rejection reason is required");
                    }
                    event.setStatus(EventStatus.REJECTED);
                    event.setRejectionReason(reason);
                    return ResponseEntity.ok(eventRepository.save(event));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
