package org.url_shortener_spring.backend.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.url_shortener_spring.backend.dtos.ClickEventDTO;
import org.url_shortener_spring.backend.dtos.UrlMappingDTO;
import org.url_shortener_spring.backend.models.ClickEvents;
import org.url_shortener_spring.backend.models.User;
import org.url_shortener_spring.backend.models.UrlMapping;
import org.url_shortener_spring.backend.repository.ClickEventRepository;
import org.url_shortener_spring.backend.repository.UrlMappingRepository;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// Service for managing URL mappings and click events.
@Service
@AllArgsConstructor
public class UrlMappingService {
    private UrlMappingRepository urlMappingRepository;
    private ClickEventRepository clickEventRepository;
    private static final String Base62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int Short_Url_length = 7;

    // Creates a short URL for the given original URL and user.
    public UrlMappingDTO createShortUrl(String originalUrl, User user) {
        String shortUrl = generateShortUrl();
        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setShortUrl(shortUrl);
        urlMapping.setCreatedDate(LocalDateTime.now());
        urlMapping.setUser(user);
        UrlMapping saveUrlMapping = urlMappingRepository.save(urlMapping);
        return convertToDTO(saveUrlMapping);
    }

    // Converts UrlMapping entity to DTO.
    private UrlMappingDTO convertToDTO(UrlMapping urlMapping) {
        UrlMappingDTO urlMappingDTO = new UrlMappingDTO();
        urlMappingDTO.setId(urlMapping.getId());
        urlMappingDTO.setOriginalUrl(urlMapping.getOriginalUrl());
        urlMappingDTO.setShortUrl(urlMapping.getShortUrl());
        urlMappingDTO.setClickCount(urlMapping.getClickCount());
        urlMappingDTO.setCreatedDate(urlMapping.getCreatedDate());
        urlMappingDTO.setUsername(urlMapping.getUser().getUsername());
        return urlMappingDTO;
    }

    // Generates a unique short URL.
    private String generateShortUrl() {
        for (int attempts = 0; attempts < 5; attempts++) {
            String shortUrl = generateRand();
            if (!urlMappingRepository.existsByShortUrl(shortUrl)) {
                return shortUrl;
            }
        }
        throw new RuntimeException("Failed to generate unique short URL after " + 5 + " attempts.Try Again!!");
    }

    // Generates a random string for short URL.
    private String generateRand() {
        StringBuilder sb = new StringBuilder(Short_Url_length);
        for (int i = 0; i < Short_Url_length; i++) {
            sb.append(Base62.charAt(SECURE_RANDOM.nextInt(62)));
        }
        return sb.toString();
    }

    // Retrieves all URL mappings for a user.
    public List<UrlMappingDTO> getUrlsByUser(User user) {
        return urlMappingRepository.findByUser(user).stream().map(this::convertToDTO).toList();
    }

    // Gets click events by date range for a short URL.
    public List<ClickEventDTO> getClickEventsByDate(String shortUrl, LocalDateTime startTime, LocalDateTime endTime) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMapping != null) {
            return clickEventRepository.findByUrlMappingAndClickDateBetween(urlMapping, startTime, endTime).stream()
                    .collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate(), Collectors.counting()))
                    .entrySet().stream()
                    .map(entry -> {
                        ClickEventDTO clickEventDTO = new ClickEventDTO();
                        clickEventDTO.setClickDate(entry.getKey());
                        clickEventDTO.setCount(entry.getValue());
                        return clickEventDTO;
                    })
                    .collect(Collectors.toList());
        }
        return null;
    }

    // Gets total clicks by user and date range.
    public Map<LocalDate, Long> getTotalClicksByUserAndDate(User user, LocalDate startDate, LocalDate endDate) {
        if (user == null || startDate == null || endDate == null) {
            throw new IllegalArgumentException("User and date range must not be null");
        }

        // Fetch all short URLs for this user
        List<UrlMapping> urlMappings = urlMappingRepository.findByUser(user);

        // If the user has no URLs, avoid calling the IN(...) query with an empty list
        if (urlMappings == null || urlMappings.isEmpty()) {
            return Map.of(); // empty map, no clicks
        }

        // Convert LocalDate range to LocalDateTime range: [startDate 00:00, endDate+1 00:00)
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();

        // Fetch all click events for those URLs in the given range
        List<ClickEvents> clickEvents = clickEventRepository
                .findByUrlMappingInAndClickDateBetween(urlMappings, startDateTime, endDateTime);

        // Group clicks by date and count them
        return clickEvents.stream()
                .collect(Collectors.groupingBy(
                        click -> click.getClickDate().toLocalDate(),
                        Collectors.counting()
                ));
    }

    // Retrieves original URL by short URL and logs a click.
    public UrlMapping getOriginalUrl(String shortUrl) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMapping != null) {
            urlMapping.setClickCount(urlMapping.getClickCount() + 1);
            urlMappingRepository.save(urlMapping);
            ClickEvents clickEvents = new ClickEvents();
            clickEvents.setClickDate(LocalDateTime.now());
            clickEvents.setUrlMapping(urlMapping);
            clickEventRepository.save(clickEvents);
        }
        return urlMapping;
    }

    // Deletes a short URL and its click events, only if it belongs to the given user
    @Transactional
    public void deleteShortUrl(Long id, User user) {
        UrlMapping urlMapping = urlMappingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Short URL not found"));

        // Security: ensure the URL belongs to the current user
        if (!urlMapping.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to delete this URL");
        }

        // Delete click events first if you don't have cascade delete set up
        clickEventRepository.deleteAllByUrlMapping(urlMapping);

        // Then delete the URL mapping itself
        urlMappingRepository.delete(urlMapping);
    }
}