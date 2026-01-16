package org.url_shortener_spring.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.url_shortener_spring.backend.models.UrlMapping;
import org.url_shortener_spring.backend.models.User;

import java.util.List;

// Marks this interface as a Spring Data repository
@Repository
public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {

    // Check if a short URL already exists
    boolean existsByShortUrl(String shortUrl);

    // Retrieve URL mapping using the short URL
    UrlMapping findByShortUrl(String shortUrl);

    // Fetch all URL mappings created by a specific user
    List<UrlMapping> findByUser(User user);
}
