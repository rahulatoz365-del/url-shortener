package org.url_shortener_spring.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.url_shortener_spring.backend.dtos.LoginRequest;
import org.url_shortener_spring.backend.dtos.RegisterRequest;
import org.url_shortener_spring.backend.models.AuthProvider;
import org.url_shortener_spring.backend.models.User;
import org.url_shortener_spring.backend.repository.UserRepository;
import org.url_shortener_spring.backend.security.jwt.JwtAuthenticationResponse;
import org.url_shortener_spring.backend.security.jwt.JwtUtils;

// Service for user registration and authentication.
@Service
@RequiredArgsConstructor
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    // Registers a new user with the provided details.
    public User registerUser(RegisterRequest registerRequest) {
        //if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        //if username already exists
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());
        user.setRole("ROLE_USER");
        user.setAuthProvider(AuthProvider.LOCAL);
        user.setProviderId(null);
        user.setImageUrl(null);
        return userRepository.save(user);
    }

    // Authenticates a user and generates a JWT.
    public JwtAuthenticationResponse authenticateUser(LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow(() -> new UsernameNotFoundException("Username not found"));
        if (user.getAuthProvider() != AuthProvider.LOCAL) {
            throw new RuntimeException("This account was created using " + user.getAuthProvider());
        }
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                        loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateToken(userDetails);
        return new JwtAuthenticationResponse(jwt);
    }

    // Finds a user by username.
    public User findByUsername(String name) {
        return userRepository.findByUsername(name).orElseThrow(() -> new UsernameNotFoundException("User not found with username:" + name));
    }

    // Finds a user by email.
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found with username:" + email));
    }

    // Finds a user by ID.
    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User not found with id:" + id));
    }
}