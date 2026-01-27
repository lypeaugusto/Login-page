package com.example.Login_auth_api.infra.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.Login_auth_api.domain.user.User;
import com.example.Login_auth_api.domain.user.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class SecurityFilter extends OncePerRequestFilter {
    @Autowired
    private TokenService tokenService;
    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        System.out.println("🔍 Requisição: " + request.getMethod() + " " + path);
        
        try {
            var token = this.recoverToken(request);
            if (token != null) {
                System.out.println("🔑 Token encontrado: " + token.substring(0, Math.min(20, token.length())) + "...");
                var login = tokenService.validarToken(token);

                if(login != null){
                    User user = userRepository.findByUsername(login).orElseThrow(() -> new RuntimeException("User Not Found"));
                    var authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
                    var authentication = new UsernamePasswordAuthenticationToken(user, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("✅ Autenticação bem-sucedida para: " + login);
                } else {
                    System.out.println("❌ Token inválido ou expirado");
                }
            } else {
                System.out.println("ℹ️  Nenhum token no header Authorization");
            }
        } catch (Exception e) {
            System.err.println("❌ Erro no SecurityFilter: " + e.getMessage());
            e.printStackTrace();
        }
        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if(authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring("Bearer ".length());
        }
        return null;
    }
}
 