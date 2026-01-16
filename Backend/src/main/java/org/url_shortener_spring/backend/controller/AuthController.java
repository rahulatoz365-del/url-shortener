package org.url_shortener_spring.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.url_shortener_spring.backend.dtos.LoginRequest;
import org.url_shortener_spring.backend.dtos.RegisterRequest;
import org.url_shortener_spring.backend.models.User;
import org.url_shortener_spring.backend.service.UserDetailsImpl;
import org.url_shortener_spring.backend.service.UserService;

import java.util.HashMap;
import java.util.Map;

// Handles authentication-related APIs
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    // Service for user authentication and management
    private final UserService userService;

    // Register a new user
    @PostMapping("/public/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.registerUser(registerRequest);

            // Build success response
            Map<String, Object> response = new HashMap<>();
            response.put("Message", "User registered successfully");
            response.put("Username", user.getUsername());
            response.put("Email", user.getEmail());
            response.put("AuthProvider", user.getAuthProvider().toString());

            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            // Handle registration errors
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Authenticate user login
    @PostMapping("/public/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            return ResponseEntity.ok(userService.authenticateUser(loginRequest));
        } catch (RuntimeException ex) {
            // Handle login errors
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Get details of the currently authenticated user
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User user = userService.findById(userDetails.getId());

        // Build user info response
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("Id", user.getId());
        userInfo.put("Username", user.getUsername());
        userInfo.put("Email", user.getEmail());
        userInfo.put("role", user.getRole());
        userInfo.put("AuthProvider", user.getAuthProvider().toString());
        userInfo.put("imageUrl", user.getImageUrl());

        return ResponseEntity.ok(userInfo);
    }

    // Provide OAuth2 authorization URLs
    @GetMapping("/public/oauth2/urls")
    public ResponseEntity<?> getOauth2Urls() {

        // OAuth2 provider endpoints
        Map<String, String> urls = new HashMap<>();
        urls.put("google", "/oauth2/authrize/google");
        urls.put("github", "/oauth2/authrize/github");

        return ResponseEntity.ok(urls);
    }
}
