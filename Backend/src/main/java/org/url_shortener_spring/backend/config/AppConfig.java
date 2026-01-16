package org.url_shortener_spring.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

// Binds application-specific configuration properties
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppConfig {

    // OAuth2-related configuration properties
    private final OAuth2 oAuth2 = new OAuth2();

    // Nested class for OAuth2 configuration
    @Getter
    @Setter
    public static class OAuth2 {

        // Authorized redirect URI for OAuth2 login
        private String authorizedRedirectUri;
    }
}
