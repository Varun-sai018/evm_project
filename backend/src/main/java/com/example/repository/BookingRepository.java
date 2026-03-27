package com.example.repository;

import com.example.model.Booking;
import com.example.model.Event;
import com.example.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByEvent(Event event);
    List<Booking> findByStatusAndEvent_StartTimeBetween(String status, LocalDateTime start, LocalDateTime end);
}
