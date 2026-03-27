package com.example.service;

import com.example.model.Event;
import com.example.model.Schedule;
import com.example.repository.EventRepository;
import com.example.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private EventRepository eventRepository;

    public List<Schedule> getSessionsByEvent(Long eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isPresent()) {
            return scheduleRepository.findByEvent(eventOpt.get());
        }
        throw new RuntimeException("Event not found");
    }

    public Schedule addSession(Long eventId, Schedule schedule) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isPresent()) {
            schedule.setEvent(eventOpt.get());
            return scheduleRepository.save(schedule);
        }
        throw new RuntimeException("Event not found");
    }

    public Schedule updateSession(Long sessionId, Schedule updatedSchedule) {
        return scheduleRepository.findById(sessionId).map(existing -> {
            existing.setSessionTitle(updatedSchedule.getSessionTitle());
            existing.setSpeaker(updatedSchedule.getSpeaker());
            existing.setStartTime(updatedSchedule.getStartTime());
            existing.setEndTime(updatedSchedule.getEndTime());
            return scheduleRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Session not found"));
    }

    public void deleteSession(Long sessionId) {
        if (!scheduleRepository.existsById(sessionId)) {
            throw new RuntimeException("Session not found");
        }
        scheduleRepository.deleteById(sessionId);
    }
}
