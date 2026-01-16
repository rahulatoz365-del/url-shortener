package org.url_shortener_spring.backend.models;

public enum AuthProvider {
    LOCAL, // Traditional username and password
    GOOGLE,// Google OAuth
    GITHUB // Github OAuth
}
