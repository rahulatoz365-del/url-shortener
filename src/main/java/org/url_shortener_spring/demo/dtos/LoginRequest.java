package org.url_shortener_spring.demo.dtos;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
