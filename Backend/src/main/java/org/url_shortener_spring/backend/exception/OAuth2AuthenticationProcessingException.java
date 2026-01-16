package org.url_shortener_spring.backend.exception;

import org.springframework.security.core.AuthenticationException;

// Custom exception for OAuth2 authentication errors
public class OAuth2AuthenticationProcessingException extends AuthenticationException {

    // Create exception with error message
    public OAuth2AuthenticationProcessingException(String msg) {
        super(msg);
    }

    // Create exception with message and root cause
    public OAuth2AuthenticationProcessingException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
