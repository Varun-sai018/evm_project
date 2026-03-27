package com.example.dto;

import com.example.model.Booking;
import com.example.model.Event;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long id;
    
    @NotNull(message = "User is required")
    private UserDTO user;

    @NotNull(message = "Event mapping is required")
    private Event event;

    @NotNull(message = "Booking time is required")
    private LocalDateTime bookedAt;
    
    @NotBlank(message = "Status cannot be empty")
    private String status;

    @NotNull(message = "Amount cannot be missing")
    private Double amount;
    
    @NotNull(message = "Payment status is required")
    private Boolean isPaid;

    public BookingDTO(Booking booking) {
        this.id = booking.getId();
        this.user = new UserDTO(booking.getUser());
        this.event = booking.getEvent();
        this.bookedAt = booking.getBookedAt();
        this.status = booking.getStatus();
        this.amount = booking.getAmount();
        this.isPaid = booking.getIsPaid();
    }
}
