package org.url_shortener_spring.backend.security.oauth2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.url_shortener_spring.backend.exception.OAuth2AuthenticationProcessingException;
import org.url_shortener_spring.backend.models.AuthProvider;
import org.url_shortener_spring.backend.models.User;
import org.url_shortener_spring.backend.repository.UserRepository;

import java.util.*;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        try {
            // HANDLE GITHUB EMAIL PRIVACY
            if (oAuth2UserRequest.getClientRegistration().getRegistrationId().equalsIgnoreCase("github")) {
                if (oAuth2User.getAttribute("email") == null) {
                    String email = fetchGitHubEmail(oAuth2UserRequest.getAccessToken().getTokenValue());
                    if (email != null) {
                        // Attributes are immutable, so we create a new mutable map
                        Map<String, Object> attributes = new HashMap<>(oAuth2User.getAttributes());
                        attributes.put("email", email);

                        // Re-create the OAuth2User with the new email
                        String userNameAttributeName = oAuth2UserRequest.getClientRegistration()
                                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

                        oAuth2User = new org.springframework.security.oauth2.core.user.DefaultOAuth2User(
                                oAuth2User.getAuthorities(),
                                attributes,
                                userNameAttributeName
                        );
                    }
                }
            }

            return processOAuth2User(oAuth2User, oAuth2UserRequest);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            // Throwing an instance of AuthenticationException will trigger the OAuth2AuthenticationFailureHandler
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private String fetchGitHubEmail(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    "https://api.github.com/user/emails",
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );

            List<Map<String, Object>> emails = response.getBody();
            if (emails != null) {
                // 1. Look for primary and verified email
                for (Map<String, Object> emailData : emails) {
                    Boolean primary = (Boolean) emailData.get("primary");
                    Boolean verified = (Boolean) emailData.get("verified");
                    if (Boolean.TRUE.equals(primary) && Boolean.TRUE.equals(verified)) {
                        return (String) emailData.get("email");
                    }
                }
                // 2. Fallback to any verified email
                for (Map<String, Object> emailData : emails) {
                    if (Boolean.TRUE.equals(emailData.get("verified"))) {
                        return (String) emailData.get("email");
                    }
                }
                // 3. Fallback to first email found
                if (!emails.isEmpty()) {
                    return (String) emails.get(0).get("email");
                }
            }
        } catch (Exception e) {
            System.out.println("Failed to fetch GitHub emails: " + e.getMessage());
        }
        return null;
    }

    private OAuth2User processOAuth2User(OAuth2User oAuth2User, OAuth2UserRequest oAuth2UserRequest) {
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(
                oAuth2UserRequest.getClientRegistration().getRegistrationId(),
                oAuth2User.getAttributes()
        );

        if (StringUtils.isEmpty(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationProcessingException("Email address is invalid (not found from provider).");
        }

        Optional<User> userOptional = userRepository.findByEmail(oAuth2UserInfo.getEmail());
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            if (!user.getProviderId().equals(oAuth2UserInfo.getId())) {
                throw new OAuth2AuthenticationProcessingException("Looks like you're signed up with " +
                        user.getAuthProvider() + " account. Please use your " + user.getAuthProvider() +
                        " account to login.");
            }
            user = updateExistingUser(user, oAuth2UserInfo);
        } else {
            user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
        }

        return CustomOAuth2User.create(user, oAuth2User.getAttributes());
    }

    private User registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) {
        User user = new User();
        user.setAuthProvider(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId().toUpperCase()));
        user.setProviderId(oAuth2UserInfo.getId());
        user.setUsername(generateUniqueUsername(oAuth2UserInfo.getName()));
        user.setEmail(oAuth2UserInfo.getEmail());
        user.setImageUrl(oAuth2UserInfo.getImageUrl());
        user.setRole("ROLE_USER");
        return userRepository.save(user);
    }

    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        existingUser.setUsername(oAuth2UserInfo.getName());
        existingUser.setImageUrl(oAuth2UserInfo.getImageUrl());
        return userRepository.save(existingUser);
    }

    private String generateUniqueUsername(String name) {
        if(name == null) name = "user";
        String baseUsername = name.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        if(baseUsername.isEmpty()) baseUsername = "user";

        String uniqueUsername = baseUsername;
        int counter = 1;
        while (userRepository.existsByUsername(uniqueUsername)) {
            uniqueUsername = baseUsername + counter++;
        }
        return uniqueUsername;
    }
}