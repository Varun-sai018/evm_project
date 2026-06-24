package com.example;

import com.example.model.User;
import com.example.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableScheduling
public class EvmApplication {

	public static void main(String[] args) {
		SpringApplication.run(EvmApplication.class, args);
	}

	@Bean
	CommandLineRunner seedAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			User admin = userRepository.findByEmail("admin@example.com")
					.orElseGet(() -> User.builder()
							.name("Admin User")
							.email("admin@example.com")
							.build());

			admin.setPassword(passwordEncoder.encode("admin123"));
			userRepository.save(admin);
		};
	}
}
