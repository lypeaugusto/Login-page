package com.example.Login_auth_api.infra.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desabilita CSRF (necessário para JWT/API REST)
            .cors(cors -> cors.configurationSource(request -> null)) // CORS configurado em CorsConfig
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Define como Stateless (sem sessão de servidor)
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()    // Libera login
                .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll() // Libera registro
                .requestMatchers("/error").permitAll() // Libera endpoint de erro para evitar 403 mascarando 404
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Permite requisições OPTIONS (preflight CORS)
                .anyRequest().authenticated() // Bloqueia o resto
            )
            .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class); // Adiciona seu filtro de token
        return http.build();
    }

    // Bean necessário para criptografar senhas (usado no Controller)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Bean necessário para autenticação (padrão do Spring Security)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
