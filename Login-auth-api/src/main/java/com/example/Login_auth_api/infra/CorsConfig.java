package com.example.Login_auth_api.infra;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Lê as origens permitidas da variável de ambiente ou usa localhost como padrão
        String allowedOriginsEnv = System.getenv("ALLOWED_ORIGINS");
        List<String> allowedOrigins;

        if (allowedOriginsEnv != null && !allowedOriginsEnv.isEmpty()) {
            // Em produção: usa as origens da variável de ambiente (separadas por vírgula)
            allowedOrigins = Arrays.asList(allowedOriginsEnv.split(","));
        } else {
            // Em desenvolvimento: usa localhost
            allowedOrigins = Arrays.asList("http://localhost:4200");
        }

        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*")); // Permite qualquer header
        configuration.setExposedHeaders(Arrays.asList("Authorization")); // Expõe o header Authorization
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // Cache de preflight por 1 hora

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}