package com.example.controller;

import com.example.model.User;
import com.example.dto.UserDTO;
import com.example.repository.UserRepository;
import com.example.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import jakarta.validation.Valid;

import com.example.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final Map<String, PasswordResetOtp> PASSWORD_RESET_OTPS = new ConcurrentHashMap<>();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        
        if (user.getRole() == null || (!user.getRole().equals("organizer") && !user.getRole().equals("user"))) {
            user.setRole("user");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        try {
            emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getName());
        } catch (Exception e) {
            System.err.println("Failed to dispatch welcome email: " + e.getMessage());
        }
        return ResponseEntity.ok(new UserDTO(savedUser));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent() && isValidPassword(user.getPassword(), existingUser.get())) {
            String token = jwtUtil.generateToken(user.getEmail());
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("message", "Login successful!");
            response.put("user", new com.example.dto.UserDTO(existingUser.get()));
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body("Invalid email or password");
    }

    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<?> sendPasswordResetOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isEmpty()) {
            return ResponseEntity.status(404).body("No account found with this email");
        }

        String otp = String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
        PASSWORD_RESET_OTPS.put(email, new PasswordResetOtp(otp, LocalDateTime.now().plusMinutes(10)));

        String body = "Hello " + existingUser.get().getName() + ",\n\n"
                + "Your EventHub password reset OTP is: " + otp + "\n\n"
                + "This OTP is valid for 10 minutes. If you did not request this, please ignore this email.";
        try {
            emailService.sendEmail(email, "EventHub Password Reset OTP", body);
        } catch (Exception e) {
            PASSWORD_RESET_OTPS.remove(email);
            return ResponseEntity.internalServerError().body("Failed to send OTP. Please check email settings and try again.");
        }

        return ResponseEntity.ok("OTP sent to your email");
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        if (email == null || email.isBlank() || otp == null || otp.isBlank() || newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body("Email, OTP, and new password are required");
        }

        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest().body("Password must be at least 6 characters");
        }

        PasswordResetOtp resetOtp = PASSWORD_RESET_OTPS.get(email);
        if (resetOtp == null || resetOtp.expiresAt().isBefore(LocalDateTime.now())) {
            PASSWORD_RESET_OTPS.remove(email);
            return ResponseEntity.status(400).body("OTP expired. Please request a new OTP.");
        }

        if (!resetOtp.otp().equals(otp)) {
            return ResponseEntity.status(400).body("Invalid OTP");
        }

        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isEmpty()) {
            return ResponseEntity.status(404).body("No account found with this email");
        }

        User user = existingUser.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        PASSWORD_RESET_OTPS.remove(email);

        return ResponseEntity.ok("Password reset successful. Please sign in with your new password.");
    }

    private boolean isValidPassword(String submittedPassword, User existingUser) {
        String savedPassword = existingUser.getPassword();
        if (savedPassword != null && savedPassword.startsWith("$2")) {
            return passwordEncoder.matches(submittedPassword, savedPassword);
        }

        if (submittedPassword != null && submittedPassword.equals(savedPassword)) {
            existingUser.setPassword(passwordEncoder.encode(submittedPassword));
            userRepository.save(existingUser);
            return true;
        }

        return false;
    }

    private record PasswordResetOtp(String otp, LocalDateTime expiresAt) {
    }
}
