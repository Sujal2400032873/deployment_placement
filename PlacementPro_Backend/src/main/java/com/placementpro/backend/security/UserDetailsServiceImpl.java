package com.placementpro.backend.security;

import com.placementpro.backend.entity.User;
import com.placementpro.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        String normalizedEmail =
                email.trim().toLowerCase();

        User user =
                userRepository
                        .findByEmail(normalizedEmail)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "User Not Found with email: "
                                                + normalizedEmail
                                )
                        );

        return UserDetailsImpl.build(user);
    }
}