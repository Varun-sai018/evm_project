package com.example.controller;

import com.example.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/event/{eventId}")
    public ResponseEntity<Map<String, Object>> getEventAnalytics(@PathVariable Long eventId) {
        try {
            return ResponseEntity.ok(analyticsService.getEventAnalytics(eventId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardSummary() {
        try {
            return ResponseEntity.ok(analyticsService.getDashboardSummary());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
