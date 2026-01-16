package org.url_shortener_spring.backend.dtos;

import lombok.Data;

import java.util.Set;
@Data
public class RegisterRequest {
    private String email;
    private String username;
    private String password;
    private String role;
}
