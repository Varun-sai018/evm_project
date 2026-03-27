package com.example.controller;

import com.example.model.Schedule;
import com.example.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Schedule>> getSessions(@PathVariable Long eventId) {
        try {
            return ResponseEntity.ok(scheduleService.getSessionsByEvent(eventId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/event/{eventId}")
    public ResponseEntity<Schedule> addSession(@PathVariable Long eventId, @RequestBody Schedule schedule) {
        try {
            return ResponseEntity.ok(scheduleService.addSession(eventId, schedule));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{sessionId}")
    public ResponseEntity<Schedule> updateSession(@PathVariable Long sessionId, @RequestBody Schedule schedule) {
        try {
            return ResponseEntity.ok(scheduleService.updateSession(sessionId, schedule));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<String> deleteSession(@PathVariable Long sessionId) {
        try {
            scheduleService.deleteSession(sessionId);
            return ResponseEntity.ok("Session deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
