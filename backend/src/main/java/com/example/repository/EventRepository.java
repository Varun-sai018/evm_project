package com.example.repository;

import com.example.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.model.EventStatus;

public interface EventRepository extends JpaRepository<Event, Long> {
    Page<Event> findByOrganizerId(Long organizerId, Pageable pageable);
    Page<Event> findByStatus(EventStatus status, Pageable pageable);
}
