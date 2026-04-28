package com.placementpro.backend.service;

import com.placementpro.backend.dto.*;
import com.placementpro.backend.entity.*;
import com.placementpro.backend.repository.*;
import com.placementpro.backend.security.JwtUtils;
import com.placementpro.backend.security.UserDetailsImpl;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log =
            LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtService;

    private final ModelMapper modelMapper;
    private final EmailService emailService;

    /*
    ========================================
    LOGIN
    ========================================
    */

    @Transactional
    public AuthResponse login(LoginRequest request) {

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        log.info("LOGIN_ATTEMPT email={}", email);

        try {

            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    request.getPassword()
                            )
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

            String token =
                    jwtService.generateJwtToken(authentication);

            UserDetailsImpl userDetails =
                    (UserDetailsImpl)
                            authentication.getPrincipal();

            User user =
                    userRepository
                            .findDetailedByEmail(
                                    userDetails.getEmail()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Authenticated user not found"
                                    )
                            );

            if (!user.isEnabled()) {

                log.warn(
                        "LOGIN_FAILED reason=USER_DISABLED email={}",
                        email
                );

                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User account is disabled"
                );
            }

            syncProfileCompletion(user);

            String primaryRole =
                    user.getRoles()
                            .stream()
                            .findFirst()
                            .map(role -> normalizeRole(role.getName()))
                            .orElse("ROLE_STUDENT");

            log.info(
                    "LOGIN_SUCCESS email={} role={}",
                    email,
                    primaryRole
            );

            UserDTO userDTO =
                    toUserDto(user);

            return AuthResponse.builder()
                    .token(token)
                    .user(userDTO)
                    .build();

        } catch (Exception ex) {

            log.error("LOGIN_EXCEPTION", ex);

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid credentials"
            );
        }
    }

    /*
    ========================================
    REGISTER (SELF)
    ========================================
    */

    @Transactional
    public MessageResponse register(
            RegisterRequest registerRequest
    ) {

        String email =
                registerRequest.getEmail()
                        .trim()
                        .toLowerCase();

        if (userRepository.existsByEmail(email)) {

            log.warn(
                    "REGISTER_FAILED reason=EMAIL_ALREADY_IN_USE email={}",
                    email
            );

            return new MessageResponse(
                    "Error: Email is already in use!"
            );
        }

        String roleName = "ROLE_STUDENT";

        Role role =
                findRole(roleName)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Role not found"
                                )
                        );

        User user =
                User.builder()
                        .name(registerRequest.getName())
                        .email(email)
                        .password(
                                passwordEncoder.encode(
                                        registerRequest.getPassword()
                                )
                        )
                        .enabled(true)
                        .profileCompleted(false)
                        .build();

        user.getRoles().add(role);

        initializeRoleProfile(user, roleName);

        userRepository.save(user);

        log.info(
                "REGISTER_SUCCESS email={} role={}",
                email,
                roleName
        );

        return new MessageResponse(
                "User registered successfully."
        );
    }

    /*
    ========================================
    ADMIN CREATE USER
    ========================================
    */

    @Transactional
    public UserDTO createUserByAdmin(RegisterRequest request) {

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        log.info("ADMIN_CREATE_USER_ATTEMPT email={}", email);

        if (userRepository.existsByEmail(email)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email already exists"
            );
        }

        final String roleName =
                normalizeRole(request.getRole());

        Role role =
                findRole(roleName)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Role not found: " + roleName
                                )
                        );

        User user =
                User.builder()
                        .name(request.getName())
                        .email(email)
                        .password(
                                passwordEncoder.encode(
                                        request.getPassword()
                                )
                        )
                        .enabled(true)
                        .profileCompleted(false)
                        .build();

        user.getRoles().add(role);

        initializeRoleProfile(user, roleName);

        userRepository.save(user);

        log.info(
                "ADMIN_CREATED_USER email={} role={}",
                email,
                roleName
        );

        return toUserDto(user);
    }

    /*
    ========================================
    FORGOT PASSWORD
    ========================================
    */

    @Transactional
    public MessageResponse forgotPassword(
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        String token =
                UUID.randomUUID().toString();

        PasswordResetToken resetToken =
                PasswordResetToken.builder()
                        .token(token)
                        .user(user)
                        .expiryDate(
                                LocalDateTime.now()
                                        .plusHours(2)
                        )
                        .build();

        passwordResetTokenRepository
                .save(resetToken);

        log.info(
                "PASSWORD_RESET_REQUESTED email={}",
                email
        );

        return new MessageResponse(
                "Password reset link created"
        );
    }

    /*
    ========================================
    RESET PASSWORD
    ========================================
    */

    @Transactional
    public MessageResponse resetPassword(
            String token,
            String newPassword
    ) {

        PasswordResetToken resetToken =
                passwordResetTokenRepository
                        .findByToken(token)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid or expired token"
                                )
                        );

        if (resetToken
                .getExpiryDate()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "Token has expired"
            );
        }

        User user =
                resetToken.getUser();

        user.setPassword(
                passwordEncoder.encode(
                        newPassword
                )
        );

        userRepository.save(user);

        passwordResetTokenRepository
                .delete(resetToken);

        log.info(
                "PASSWORD_RESET_SUCCESS email={}",
                user.getEmail()
        );

        return new MessageResponse(
                "Password has been reset successfully"
        );
    }

    /*
    ========================================
    HELPERS
    ========================================
    */

    private UserDTO toUserDto(User user) {

        UserDTO userDTO =
                modelMapper.map(
                        user,
                        UserDTO.class
                );

        userDTO.setRole(
                user.getRoles()
                        .stream()
                        .findFirst()
                        .map(role -> normalizeRole(role.getName()))
                        .orElse("ROLE_STUDENT")
        );

        boolean profileCompleted =
                isProfileComplete(user);

        userDTO.setProfileCompleted(profileCompleted);
        userDTO.setProfileComplete(profileCompleted);

        return userDTO;
    }

    private boolean isProfileComplete(User user) {

        String role =
                user.getRoles()
                        .stream()
                        .findFirst()
                        .map(userRole -> normalizeRole(userRole.getName()))
                        .orElse("");

        return switch (role) {

            case "ROLE_ADMIN" -> true;

            case "ROLE_STUDENT" ->
                    isStudentProfileComplete(user.getStudentProfile());

            case "ROLE_EMPLOYER" ->
                    isEmployerProfileComplete(user.getEmployerProfile());

            case "ROLE_PLACEMENT_OFFICER" ->
                    isPlacementProfileComplete(user.getPlacementProfile());

            default -> false;
        };
    }

    private void initializeRoleProfile(
            User user,
            String role
    ) {

        switch (role) {

            case "ROLE_STUDENT" ->
                    user.setStudentProfile(
                            StudentProfile.builder()
                                    .user(user)
                                    .build()
                    );

            case "ROLE_EMPLOYER" ->
                    user.setEmployerProfile(
                            EmployerProfile.builder()
                                    .user(user)
                                    .build()
                    );

            case "ROLE_PLACEMENT_OFFICER" ->
                    user.setPlacementProfile(
                            PlacementProfile.builder()
                                    .user(user)
                                    .build()
                    );

            case "ROLE_ADMIN" -> { }

            default ->
                    throw new RuntimeException(
                            "Unsupported role"
                    );
        }
    }

    private String normalizeRole(String role) {
        String normalized =
                role == null || role.isBlank()
                        ? "ROLE_STUDENT"
                        : role.trim().toUpperCase();

        return normalized.startsWith("ROLE_")
                ? normalized
                : "ROLE_" + normalized;
    }

    private java.util.Optional<Role> findRole(String role) {
        String normalizedRole = normalizeRole(role);
        String legacyRole = normalizedRole.replaceFirst("^ROLE_", "");

        return roleRepository.findByName(normalizedRole)
                .or(() -> roleRepository.findByName(legacyRole));
    }

    private boolean isStudentProfileComplete(StudentProfile profile) {
        return profile != null
                && hasText(profile.getRollNumber())
                && hasText(profile.getBranch())
                && hasText(profile.getSkills())
                && profile.getCgpa() != null
                && profile.getGraduationYear() != null
                && hasText(profile.getResumeUrl());
    }

    private boolean isEmployerProfileComplete(EmployerProfile profile) {
        return profile != null
                && hasText(profile.getCompanyName())
                && hasText(profile.getIndustry())
                && hasText(profile.getCompanySize())
                && hasText(profile.getWebsite())
                && hasText(profile.getDescription())
                && hasText(profile.getHrContact());
    }

    private boolean isPlacementProfileComplete(PlacementProfile profile) {
        return profile != null
                && hasText(profile.getDepartment())
                && hasText(profile.getDesignation())
                && hasText(profile.getCollegeName())
                && hasText(profile.getContactNumber());
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private void syncProfileCompletion(User user) {

        boolean completed =
                isProfileComplete(user);

        if (user.isProfileCompleted() != completed) {

            user.setProfileCompleted(completed);

            userRepository.save(user);
        }
    }
}
