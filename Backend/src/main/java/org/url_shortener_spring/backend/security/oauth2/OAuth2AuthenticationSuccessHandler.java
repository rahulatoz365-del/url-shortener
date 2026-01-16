package org.url_shortener_spring.backend.security.oauth2;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import org.url_shortener_spring.backend.models.User;
import org.url_shortener_spring.backend.repository.UserRepository;
import org.url_shortener_spring.backend.security.jwt.JwtUtils;
import org.url_shortener_spring.backend.service.UserDetailsImpl;

import java.io.IOException;

// Handles successful OAuth2 authentication by generating JWT and redirecting to frontend.
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    @Value("${app.oauth2.authorizedRedirectUri}")
    private String redirectUri;

    // Called when OAuth2 authentication succeeds - redirects to frontend with JWT.
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        String targetUrl = getTargetUri(authentication);

        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    // Builds the redirect URI with JWT token as query parameter.
    protected String getTargetUri(Authentication authentication) {
        // Get custom OAuth2 user from authentication principal
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        // Fetch the user from database using internal ID
        User user = userRepository.findById(oAuth2User.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Build UserDetails implementation from the user entity
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);

        // Generate JWT token for the authenticated user
        String token = jwtUtils.generateToken(userDetails);

        // Construct frontend redirect URL with JWT in query parameter
        return UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .build()
                .toUriString();
    }
}