package org.url_shortener_spring.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.url_shortener_spring.backend.models.ClickEvents;
import org.url_shortener_spring.backend.models.UrlMapping;

import java.time.LocalDateTime;
import java.util.List;

// Marks this interface as a Spring Data repository
@Repository
public interface ClickEventRepository extends JpaRepository<ClickEvents, Long> {

    // Fetch click events for a specific URL mapping within a date range
    List<ClickEvents> findByUrlMappingAndClickDateBetween(
            UrlMapping mapping,
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    // Fetch click events for multiple URL mappings within a date range
    List<ClickEvents> findByUrlMappingInAndClickDateBetween(
            List<UrlMapping> urlMappings,
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    void deleteAllByUrlMapping(UrlMapping urlMapping);
}
