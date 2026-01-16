package org.url_shortener_spring.backend.security.oauth2;

import java.util.Map;

// GitHub-specific implementation of OAuth2 user information extractor.
public class GitHubOAuth2UserInfo extends OAuth2UserInfo {

    public GitHubOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    // Returns the unique user ID from GitHub (as string).
    @Override
    public String getId() {
        return ((Integer) attributes.get("id")).toString();
    }

    // Returns the user's email (may be null if not public).
    @Override
    public String getEmail() {
        return (String) attributes.get("email");
    }

    // Returns the user's display name, falling back to login/username if name is missing.
    @Override
    public String getName() {
        String name = (String) attributes.get("name");
        if (name == null || name.isEmpty()) {
            name = (String) attributes.get("login");
        }
        return name;
    }

    // Returns the URL of the user's profile avatar image.
    @Override
    public String getImageUrl() {
        return (String) attributes.get("avatar_url");
    }
}