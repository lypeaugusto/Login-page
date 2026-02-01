package com.example.Login_auth_api.controllers;

import com.example.Login_auth_api.domain.todo.Todo;
import com.example.Login_auth_api.domain.todo.TodoRepository;
import com.example.Login_auth_api.domain.user.User;
import com.example.Login_auth_api.domain.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TodoRepository todoRepository;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getUserProfile() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Todo> todos = todoRepository.findByUserId(user.getId());
        return ResponseEntity
                .ok(new UserProfileDTO(user.getName(), user.getEmail(), user.getFavoriteCity(), user.getPicture(),
                        todos));
    }

    @PostMapping("/city")
    public ResponseEntity<Void> updateCity(@RequestBody String city) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        user.setFavoriteCity(city);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update")
    public ResponseEntity<Void> updateProfile(@RequestBody UpdateUserDTO data) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Atualiza os dados
        if (data.name() != null)
            user.setName(data.name());
        if (data.email() != null)
            user.setEmail(data.email());

        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    public record UpdateUserDTO(String name, String email) {
    }

    @GetMapping("/todos")
    public ResponseEntity<List<Todo>> getTodos() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(todoRepository.findByUserId(user.getId()));
    }

    @PostMapping("/todos")
    public ResponseEntity<Todo> addTodo(@RequestBody Todo todo) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        todo.setUser(user);
        return ResponseEntity.ok(todoRepository.save(todo));
    }

    @PutMapping("/todos/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
        Optional<Todo> todoOpt = todoRepository.findById(id);
        if (todoOpt.isPresent()) {
            Todo todo = todoOpt.get();
            todo.setCompleted(todoDetails.isCompleted());
            todo.setText(todoDetails.getText());
            todo.setDueDate(todoDetails.getDueDate());
            return ResponseEntity.ok(todoRepository.save(todo));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/todos/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadPicture(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            java.nio.file.Path path = java.nio.file.Paths.get("uploads", fileName);
            java.nio.file.Files.createDirectories(path.getParent());
            java.nio.file.Files.copy(file.getInputStream(), path, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            user.setPicture("/uploads/" + fileName);
            userRepository.save(user);

            return ResponseEntity.ok("/uploads/" + fileName);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    public record UserProfileDTO(String name, String email, String favoriteCity, String picture, List<Todo> todos) {
    }
}
