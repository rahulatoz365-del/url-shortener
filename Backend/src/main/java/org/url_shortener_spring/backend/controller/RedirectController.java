package org.url_shortener_spring.backend.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.url_shortener_spring.backend.models.UrlMapping;
import org.url_shortener_spring.backend.service.UrlMappingService;

// Handles URL redirection based on short URL
@AllArgsConstructor
@RestController
public class RedirectController {

    // Service for resolving short URLs to original URLs
    private UrlMappingService urlMappingService;

    // Redirect to the original URL using short URL
    @GetMapping("/{shortUrl}")
    public ResponseEntity<Void> redirect(@PathVariable String shortUrl) {

        // Fetch URL mapping for the short URL
        UrlMapping urlMapping = urlMappingService.getOriginalUrl(shortUrl);

        if (urlMapping != null) {
            // Set HTTP redirect location
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.add("Location", urlMapping.getOriginalUrl());

            // Return 302 redirect response
            return ResponseEntity.status(302).headers(httpHeaders).build();
        } else {
            // Return 404 if short URL not found
            return ResponseEntity.notFound().build();
        }
    }
}
