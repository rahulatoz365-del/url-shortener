package org.url_shortener_spring.backend.security.oauth2;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.url_shortener_spring.backend.models.User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

// Custom OAuth2 user implementation that wraps our User entity.
public class CustomOAuth2User implements OAuth2User {

    private Long id;
    private String username;
    private String email;
    private Map<String, Object> attributes;
    private Collection<? extends GrantedAuthority> authorities;

    public CustomOAuth2User(String username, Long id, String email, Collection<? extends GrantedAuthority> authorities) {
        this.username = username;
        this.id = id;
        this.email = email;
        this.authorities = authorities;
    }

    // Creates CustomOAuth2User from existing User entity and OAuth2 attributes.
    public static CustomOAuth2User create(User user, Map<String, Object> attributes) {
        CustomOAuth2User customOAuth2User = new CustomOAuth2User(
                user.getEmail(),
                user.getId(),
                user.getUsername(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
        );
        customOAuth2User.setAttributes(attributes);
        return customOAuth2User;
    }

    // Returns the attributes received from the OAuth2 provider.
    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    // Returns the authorities granted to the user.
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    // Returns the name used to identify the user (here we use the internal ID).
    @Override
    public String getName() {
        return String.valueOf(id);
    }

    // Getter for internal user ID.
    public Long getId() {
        return id;
    }

    // Getter for username.
    public String getUsername() {
        return username;
    }

    // Getter for email.
    public String getEmail() {
        return email;
    }

    // Sets the OAuth2 provider attributes.
    public void setAttributes(Map<String, Object> attributes) {
        this.attributes = attributes;
    }
}