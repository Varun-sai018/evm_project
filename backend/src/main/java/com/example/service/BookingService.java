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

    @Autowired
    private EmailService emailService;

    public Booking bookEvent(Long userId, Long eventId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Event> eventOpt = eventRepository.findById(eventId);

        if (userOpt.isPresent() && eventOpt.isPresent()) {
            Event event = eventOpt.get();
            User user = userOpt.get();
            
            // Capacity Check
            if (event.getCapacity() != null) {
                long currentBookings = bookingRepository.findByEvent(event).stream()
                        .filter(b -> !"CANCELLED".equals(b.getStatus()))
                        .count();
                if (currentBookings >= event.getCapacity()) {
                    throw new RuntimeException("Event is sold out");
                }
            }

            Booking booking = new Booking();
            booking.setUser(user);
            booking.setEvent(event);
            booking.setBookedAt(LocalDateTime.now());
            booking.setStatus("RESERVED"); // Reservation System Pattern
            booking.setAmount(event.getTicketPrice() != null ? event.getTicketPrice() : 0.0);
            booking.setIsPaid(false);
            
            // Generate Booking Reference
            String reference = "EVT-2026-" + java.util.UUID.randomUUID().toString().substring(0, 5).toUpperCase();
            booking.setBookingReference(reference);
            
            Booking savedBooking = bookingRepository.save(booking);
            
            // Send Email
            try {
                emailService.sendBookingConfirmation(user.getEmail(), user.getName(), event, reference);
            } catch (Exception e) {
                System.err.println("Failed to send booking confirmation: " + e.getMessage());
            }
            
            return savedBooking;
        }
        throw new RuntimeException("User or Event not found");
    }

    public void cancelBooking(Long bookingId) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus("CANCELLED");
            bookingRepository.save(booking);
            
            try {
                emailService.sendCancellationNotice(booking.getUser().getEmail(), booking.getUser().getName(), booking.getEvent());
            } catch (Exception e) {
                System.err.println("Failed to send cancellation notice: " + e.getMessage());
            }
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
