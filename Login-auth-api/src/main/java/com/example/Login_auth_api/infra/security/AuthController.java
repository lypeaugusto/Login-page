package com.example.Login_auth_api.infra.security;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Login_auth_api.domain.user.User;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    public AuthController(TokenService tokenService, AuthenticationManager authenticationManager, CustomUserDetailsService userDetailsService) {
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequestDTO body){
        var usernamePassword = new UsernamePasswordAuthenticationToken(body.username(), body.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var token = tokenService.gerarToken((User) auth.getPrincipal());
        return ResponseEntity.ok(new ResponseDTO(body.username(), token));
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterRequestDTO body){
        // O nome será usado como username
        this.userDetailsService.registerUser(body.name(), body.password(), body.email());
        
        // Gera um token para o usuário recém-criado para já logar automaticamente
        User newUser = new User();
        newUser.setUsername(body.name());
        newUser.setEmail(body.email());
        var token = this.tokenService.gerarToken(newUser);
        
        return ResponseEntity.ok(new ResponseDTO(body.name(), token));
    }
    
    public record LoginRequestDTO (String username, String password) {}
    public record RegisterRequestDTO (String name, String email, String password) {}
    public record ResponseDTO (String name, String token) {}
}