package org.url_shortener_spring.backend.dtos;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
