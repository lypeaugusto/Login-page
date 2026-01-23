package com.example.Login_auth_api.AuthController;

import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Login_auth_api.domain.user.LoginRequest;
import com.example.Login_auth_api.domain.user.LoginResponse;
import com.example.Login_auth_api.domain.user.RegisterRequest;
import com.example.Login_auth_api.domain.user.User;
import com.example.Login_auth_api.domain.user.UserRepository;
import com.example.Login_auth_api.infra.security.TokenService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class Controllers {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername()).orElse(null);
        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        String token = tokenService.gerarToken(user);
        return ResponseEntity.ok(new LoginResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest body) {
        Optional<User> user = this.userRepository.findByEmail(body.getEmail());

        if (user.isPresent()) {
            return ResponseEntity.badRequest().body("User already exists");
        }

        User newUser = new User();
        newUser.setPassword(passwordEncoder.encode(body.getPassword()));
        newUser.setEmail(body.getEmail());
        newUser.setName(body.getName());
        newUser.setUsername(body.getUsername());
        this.userRepository.save(newUser);
        String token = this.tokenService.gerarToken(newUser);
        return ResponseEntity.ok(new LoginResponse(token));
    }
}
