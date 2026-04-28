package com.placementpro.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import org.springframework.lang.NonNull;

import java.io.IOException;

public class AuthTokenFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
protected boolean shouldNotFilter(HttpServletRequest request) {

    String path = request.getRequestURI();

    return path.equals("/api/auth/login")
        || path.equals("/api/auth/register")
        || path.equals("/api/auth/forgot-password")
        || path.equals("/api/auth/reset-password")
        || path.startsWith("/api/health")
        || path.startsWith("/uploads/")
        || request.getMethod().equalsIgnoreCase("OPTIONS");
}

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String email = jwtUtils.getEmailFromJwtToken(jwt);

                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.debug("AUTH_TOKEN_VALIDATED path={} user={}", request.getRequestURI(), email);
            } else if (jwt != null) {
                logger.warn("AUTH_TOKEN_INVALID path={}", request.getRequestURI());
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {

    // 1) Check Authorization header
    String headerAuth = request.getHeader("Authorization");

    if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
        return headerAuth.substring(7);
    }

    // 2) Fallback to cookie
    if (request.getCookies() != null) {
        for (Cookie cookie : request.getCookies()) {
            if ("placementpro_token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
    }

    return null;
}
}
