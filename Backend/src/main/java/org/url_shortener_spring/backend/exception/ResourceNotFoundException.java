package org.url_shortener_spring.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Thrown when a requested resource is not found
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    // Create exception with error message
    public ResourceNotFoundException(String message) {
        super(message);
    }

    // Create exception with message and root cause
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
