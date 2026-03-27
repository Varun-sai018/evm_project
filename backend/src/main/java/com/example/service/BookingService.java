package com.example.service;

import com.example.model.Booking;
import com.example.model.Event;
import com.example.model.User;
import com.example.repository.BookingRepository;
import com.example.repository.EventRepository;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    public Booking bookEvent(Long userId, Long eventId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Event> eventOpt = eventRepository.findById(eventId);

        if (userOpt.isPresent() && eventOpt.isPresent()) {
            Event event = eventOpt.get();
            Booking booking = new Booking();
            booking.setUser(userOpt.get());
            booking.setEvent(event);
            booking.setBookedAt(LocalDateTime.now());
            booking.setStatus("PENDING");
            booking.setAmount(event.getTicketPrice() != null ? event.getTicketPrice() : 0.0);
            booking.setIsPaid(false);
            return bookingRepository.save(booking);
        }
        throw new RuntimeException("User or Event not found");
    }

    public void cancelBooking(Long bookingId) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus("CANCELLED");
            bookingRepository.save(booking);
        } else {
            throw new RuntimeException("Booking not found");
        }
    }

    public List<Booking> getUserBookings(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return bookingRepository.findByUser(userOpt.get()).stream()
                    .filter(b -> !"CANCELLED".equals(b.getStatus()))
                    .collect(Collectors.toList());
        }
        throw new RuntimeException("User not found");
    }

    public List<Booking> getEventAttendees(Long eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isPresent()) {
            return bookingRepository.findByEvent(eventOpt.get()).stream()
                    .filter(b -> !"CANCELLED".equals(b.getStatus()))
                    .collect(Collectors.toList());
        }
        throw new RuntimeException("Event not found");
    }
}
