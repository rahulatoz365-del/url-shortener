package org.url_shortener_spring.backend.security.oauth2;

import org.url_shortener_spring.backend.exception.OAuth2AuthenticationProcessingException;

import java.util.Map;

// Factory class to create correct OAuth2UserInfo based on the provider
public class OAuth2UserInfoFactory {

    // Returns the appropriate OAuth2UserInfo implementation for the given provider
    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        // Handle Google provider
        if (registrationId.equalsIgnoreCase("google")) {
            return new GoogleOAuth2UserInfo(attributes);
        }

        // Handle GitHub provider
        if (registrationId.equalsIgnoreCase("github")) {
            return new GitHubOAuth2UserInfo(attributes);
        }

        // Throw exception for unsupported providers
        throw new OAuth2AuthenticationProcessingException(
                "Invalid registration id: " + registrationId
        );
    }
}