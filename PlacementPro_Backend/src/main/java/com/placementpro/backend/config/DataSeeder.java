package com.placementpro.backend.config;

import com.placementpro.backend.entity.Role;
import com.placementpro.backend.entity.User;
import com.placementpro.backend.repository.RoleRepository;
import com.placementpro.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final Logger log =
        LoggerFactory.getLogger(DataSeeder.class);

    @Override
    public void run(String... args) {

        log.info("Starting database seeding...");

        Role adminRole = ensureRole("ROLE_ADMIN");
        ensureRole("ROLE_STUDENT");
        ensureRole("ROLE_EMPLOYER");
        ensureRole("ROLE_PLACEMENT_OFFICER");

        if (userRepository.count() == 0) {

            User admin = User.builder()
                .name("Admin User")
                .email("admin@placementpro.com")
                .password(passwordEncoder.encode("Admin@123"))
                .enabled(true)
                .build();

            admin.getRoles().add(adminRole);

            userRepository.save(admin);

            log.info("Default admin user created.");
        }

        log.info("Database seeding completed.");
    }

    private Role ensureRole(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(Role.builder().name(roleName).build()));
    }
}
