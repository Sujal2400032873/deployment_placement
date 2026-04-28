package com.placementpro.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC configuration.
 * NOTE: CORS is fully handled by SecurityConfig.corsConfigurationSource()
 * which is registered directly with Spring Security's filter chain.
 * 
 * Rate limiting and interceptors have been removed for simplicity.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    // Kept minimal for future MVC-level configurations (view resolvers, formatters, etc.)
}
