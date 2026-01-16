package org.url_shortener_spring.backend.security.jwt;

import lombok.AllArgsConstructor;
import lombok.Data;

// Response class for JWT authentication.
@Data
@AllArgsConstructor
public class JwtAuthenticationResponse {
    private String token;
}