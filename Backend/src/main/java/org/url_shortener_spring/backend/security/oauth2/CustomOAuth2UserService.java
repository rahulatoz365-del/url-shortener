package org.url_shortener_spring.backend.security.oauth2;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.url_shortener_spring.backend.exception.OAuth2AuthenticationProcessingException;
import org.url_shortener_spring.backend.models.AuthProvider;
import org.url_shortener_spring.backend.models.User;
import org.url_shortener_spring.backend.repository.UserRepository;

import java.util.Optional;

// Custom service to load and process OAuth2 users (Google, GitHub, etc.).
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    // Loads the OAuth2 user and processes it into our application user.
    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);
        try {
            return processOAuth2User(oAuth2User, oAuth2UserRequest);
        } catch (OAuth2AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    // Processes OAuth2 user data, handles existing/new users and provider validation.
    private OAuth2User processOAuth2User(OAuth2User oAuth2User, OAuth2UserRequest oAuth2UserRequest) {
        String registrationId = oAuth2UserRequest.getClientRegistration().getRegistrationId();

        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(
                registrationId,
                oAuth2User.getAttributes()
        );

        // Email is required for account linking
        if (oAuth2UserInfo.getEmail() == null || oAuth2UserInfo.getEmail().isEmpty()) {
            throw new OAuth2AuthenticationProcessingException("Email address is invalid");
        }

        Optional<User> userOptional = userRepository.findByEmail(oAuth2UserInfo.getEmail());
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
            AuthProvider currentAuthProvider = AuthProvider.valueOf(registrationId.toUpperCase());

            // Prevent login with different provider for same email
            if (!user.getAuthProvider().equals(currentAuthProvider)) {
                throw new OAuth2AuthenticationProcessingException(
                        "You are already logged in with " + user.getAuthProvider()
                );
            }

            // Update existing user info
            user = updateUser(user, oAuth2UserInfo);
        } else {
            // Create new user
            user = registerUser(registrationId, oAuth2UserInfo);
        }

        // Return custom OAuth2User wrapper
        return CustomOAuth2User.create(user, oAuth2User.getAttributes());
    }

    // Generates a unique username based on the name from OAuth2 provider.
    private String generateUniqueUsername(String name) {
        String baseUsername = name.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        String uniqueUsername = baseUsername;
        int counter = 1;

        while (userRepository.existsByUsername(uniqueUsername)) {
            uniqueUsername = baseUsername + counter;
            counter++;
        }
        return uniqueUsername;
    }

    // Registers a new user from OAuth2 provider data.
    private User registerUser(String registrationId, OAuth2UserInfo oAuth2UserInfo) {
        User user = new User();
        user.setAuthProvider(AuthProvider.valueOf(registrationId.toUpperCase()));
        user.setProviderId(oAuth2UserInfo.getId());
        user.setEmail(oAuth2UserInfo.getEmail());
        user.setImageUrl(oAuth2UserInfo.getImageUrl());
        user.setRole("ROLE_USER");
        user.setUsername(generateUniqueUsername(oAuth2UserInfo.getName()));
        return userRepository.save(user);
    }

    // Updates existing user's profile information.
    private User updateUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        existingUser.setUsername(oAuth2UserInfo.getName());
        existingUser.setImageUrl(oAuth2UserInfo.getImageUrl());
        return userRepository.save(existingUser);
    }
}