package org.url_shortener_spring.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.url_shortener_spring.demo.models.UrlMapping;
import org.url_shortener_spring.demo.models.User;

import java.util.List;
import java.util.Optional;
@Repository
public interface UrlMappingRepository extends JpaRepository<UrlMapping,Long> {
    boolean existsByShortUrl(String shortUrl);
    UrlMapping findByShortUrl(String shortUrl);
    List<UrlMapping> findByUser(User user);
}
