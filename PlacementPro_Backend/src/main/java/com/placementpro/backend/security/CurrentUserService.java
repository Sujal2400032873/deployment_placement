package com.placementpro.backend.security;

import com.placementpro.backend.entity.User;
import com.placementpro.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Unauthorized");
        }

        return userRepository.findDetailedByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    public boolean hasRole(User user, String roleName) {
        String expectedRole = normalizeRole(roleName);
        return user.getRoles().stream()
                .anyMatch(role -> expectedRole.equals(normalizeRole(role.getName())));
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "";
        }

        String normalized = role.trim().toUpperCase();
        return normalized.startsWith("ROLE_") ? normalized : "ROLE_" + normalized;
    }
}
