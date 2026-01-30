package com.example.Login_auth_api.infra.security;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.example.Login_auth_api.domain.user.User;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    public String gerarToken(User user) {
        try {
            System.out.println("🔐 Secret usado para gerar: " + secret);
            System.out.println("👤 Gerando token para username: " + user.getUsername());
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("auth0")
                    .withSubject(user.getEmail())
                    .withClaim("name", user.getName())
                    .withClaim("email", user.getEmail())
                    .withExpiresAt(dataExpiracao())
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }
    }

    public String validarToken(String token) {
        try {
            System.out.println("🔐 Secret usado para validar: " + secret);
            Algorithm algorithm = Algorithm.HMAC256(secret);
            var decodedJWT = JWT.require(algorithm)
                    .withIssuer("auth0")
                    .build()
                    .verify(token);
            String subject = decodedJWT.getSubject();
            System.out.println("✓ Token válido. Subject: " + subject);
            System.out.println("  Claims: " + decodedJWT.getClaims());
            return subject;
        } catch (JWTVerificationException exception) {
            System.out.println("✗ Erro ao validar token: " + exception.getMessage());
            exception.printStackTrace();
            return null;
        }
    }

    private Instant dataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
