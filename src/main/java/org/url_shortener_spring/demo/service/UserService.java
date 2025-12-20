package org.url_shortener_spring.demo.service;


import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.url_shortener_spring.demo.dtos.LoginRequest;
import org.url_shortener_spring.demo.models.User;
import org.url_shortener_spring.demo.repository.UserRepository;
import org.url_shortener_spring.demo.security.jwt.JwtAuthenticationResponse;
import org.url_shortener_spring.demo.security.jwt.JwtUtils;

@Service
@AllArgsConstructor
public class UserService {
    private PasswordEncoder passwordEncoder;
    private UserRepository userRepository;
    private AuthenticationManager authenticationManager;
    private JwtUtils jwtUtils;
    public User registerUser(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    public JwtAuthenticationResponse authenticateUser(LoginRequest loginRequest){
        Authentication authentication=authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                        loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails=(UserDetailsImpl) authentication.getPrincipal();
        String jwt=jwtUtils.generateToken(userDetails);
        return new JwtAuthenticationResponse(jwt);
    }
    public User findByUsername(String name){
        return userRepository.findByUsername(name).orElseThrow(()->new UsernameNotFoundException("User not found with username:"+name));
    }
}
