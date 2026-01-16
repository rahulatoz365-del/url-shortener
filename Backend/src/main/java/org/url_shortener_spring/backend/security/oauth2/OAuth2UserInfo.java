package org.url_shortener_spring.backend.security.oauth2;

import java.util.Map;

// Abstract base class for extracting standardized user information from different OAuth2 providers.
public abstract class OAuth2UserInfo {

    protected Map<String, Object> attributes;

    public OAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    // Returns the user's display name.
    public abstract String getName();

    // Returns the user's email address.
    public abstract String getEmail();

    // Returns the URL of the user's profile picture/avatar.
    public abstract String getImageUrl();

    // Returns the unique identifier for the user from the provider.
    public abstract String getId();

    // Returns the raw attributes map received from the OAuth2 provider.
    public Map<String, Object> getAttributes() {
        return attributes;
    }
}