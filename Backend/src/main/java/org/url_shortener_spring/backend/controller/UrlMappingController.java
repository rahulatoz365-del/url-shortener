package org.url_shortener_spring.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.url_shortener_spring.backend.dtos.ClickEventDTO;
import org.url_shortener_spring.backend.dtos.UrlMappingDTO;
import org.url_shortener_spring.backend.models.User;
import org.url_shortener_spring.backend.service.UrlMappingService;
import org.url_shortener_spring.backend.service.UserService;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

// Handles URL shortening and analytics APIs
@RestController
@RequestMapping("/api/urls")
@RequiredArgsConstructor
public class UrlMappingController {

    // Service for URL mapping operations
    private final UrlMappingService urlMappingService;

    // Service for user-related operations
    private final UserService userService;

    // Create a short URL for the authenticated user
    @PostMapping("/shorten")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UrlMappingDTO> createShortUrl(
            @RequestBody Map<String, String> request,
            Principal principal) {

        // Extract original URL from request
        String originalUrl = request.get("originalUrl");

        // Get currently logged-in user
        User user = userService.findByUsername(principal.getName());

        // Generate short URL
        UrlMappingDTO urlMappingDTO =
                urlMappingService.createShortUrl(originalUrl, user);

        return ResponseEntity.ok(urlMappingDTO);
    }

    //Get ShortUrls of user
    @GetMapping("/myurls")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<UrlMappingDTO>> getUserUrls(Principal principal) {

        // Get authenticated user
        User user = userService.findByUsername(principal.getName());

        // Fetch URL mappings for this user
        List<UrlMappingDTO> urls = urlMappingService.getUrlsByUser(user);

        return ResponseEntity.ok(urls);
    }

    // Get click analytics for a short URL within a date range
    @GetMapping("/analytics/{shortUrl}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ClickEventDTO>> getUrlAnalytics(
            @PathVariable String shortUrl,
            @RequestParam("startDate") String start,
            @RequestParam("endDate") String end) {

        // Parse date-time parameters
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        LocalDateTime startDate = LocalDateTime.parse(start, formatter);
        LocalDateTime endDate = LocalDateTime.parse(end, formatter);

        // Fetch click event analytics
        List<ClickEventDTO> clickEventDTOS =
                urlMappingService.getClickEventsByDate(shortUrl, startDate, endDate);

        return ResponseEntity.ok(clickEventDTOS);
    }

    // Get total clicks grouped by date for the authenticated user
    @GetMapping("/totalClicks")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<LocalDate, Long>> getTotalClicks(
            Principal principal,
            @RequestParam("startDate") String start,
            @RequestParam("endDate") String end) {

        // Parse date parameters
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
        LocalDate startDate = LocalDate.parse(start, formatter);
        LocalDate endDate = LocalDate.parse(end, formatter);

        // Get authenticated user
        User user = userService.findByUsername(principal.getName());

        // Fetch total clicks per date
        Map<LocalDate, Long> totalClicks =
                urlMappingService.getTotalClicksByUserAndDate(user, startDate, endDate);

        return ResponseEntity.ok(totalClicks);
    }

    // Delete a short URL owned by the authenticated user
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteShortUrl(
            @PathVariable Long id,
            Principal principal
    ) {
        // Get authenticated user
        User user = userService.findByUsername(principal.getName());

        // Delegate deletion to service layer
        urlMappingService.deleteShortUrl(id, user);

        // 204 No Content is standard for successful delete
        return ResponseEntity.noContent().build();
    }

}
