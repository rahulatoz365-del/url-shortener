package org.url_shortener_spring.backend.security.oauth2;

import java.util.Map;

// Google-specific implementation of OAuth2 user information extractor.
public class GoogleOAuth2UserInfo extends OAuth2UserInfo {

    public GoogleOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    // Returns the unique user ID (subject) from Google.
    @Override
    public String getId() {
        return (String) attributes.get("sub");
    }

    // Returns the user's full name.
    @Override
    public String getName() {
        return (String) attributes.get("name");
    }

    // Returns the user's email address.
    @Override
    public String getEmail() {
        return (String) attributes.get("email");
    }

    // Returns the URL of the user's profile picture.
    @Override
    public String getImageUrl() {
        return (String) attributes.get("picture");
    }
}