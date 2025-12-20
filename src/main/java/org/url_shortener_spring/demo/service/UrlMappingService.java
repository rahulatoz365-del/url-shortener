package org.url_shortener_spring.demo.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.url_shortener_spring.demo.dtos.ClickEventDTO;
import org.url_shortener_spring.demo.dtos.UrlMappingDTO;
import org.url_shortener_spring.demo.models.ClickEvents;
import org.url_shortener_spring.demo.models.User;
import org.url_shortener_spring.demo.models.UrlMapping;
import org.url_shortener_spring.demo.repository.ClickEventRepository;
import org.url_shortener_spring.demo.repository.UrlMappingRepository;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor

public class UrlMappingService {
    private UrlMappingRepository urlMappingRepository;
    private ClickEventRepository clickEventRepository;
    private static final String Base62= "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final SecureRandom SECURE_RANDOM=new SecureRandom();
    private static final int Short_Url_length=7;

    public UrlMappingDTO createShortUrl(String originalUrl,User user){
        String shortUrl = generateShortUrl();
        UrlMapping urlMapping=new UrlMapping();
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setShortUrl(shortUrl);
        urlMapping.setCreatedDate(LocalDateTime.now());
        urlMapping.setUser(user);
        UrlMapping saveUrlMapping = urlMappingRepository.save(urlMapping);
        return convertToDTO(saveUrlMapping);
    }
    private UrlMappingDTO convertToDTO(UrlMapping urlMapping){
        UrlMappingDTO urlMappingDTO=new UrlMappingDTO();
        urlMappingDTO.setId(urlMapping.getId());
        urlMappingDTO.setOriginalUrl(urlMapping.getOriginalUrl());
        urlMappingDTO.setShortUrl(urlMapping.getShortUrl());
        urlMappingDTO.setClickCount(urlMapping.getClickCount());
        urlMappingDTO.setCreatedDate(urlMapping.getCreatedDate());
        urlMappingDTO.setUsername(urlMapping.getUser().getUsername());
        return urlMappingDTO;
    }
    private String  generateShortUrl(){
            for (int attempts = 0; attempts < 5; attempts++) {
                String shortUrl = generateRand();
                if (!urlMappingRepository.existsByShortUrl(shortUrl)) {
                    return shortUrl;
                }
            }
            throw new RuntimeException("Failed to generate unique short URL after " + 5 + " attempts.Try Again!!");
    }
    private String generateRand(){
        StringBuilder sb=new StringBuilder(Short_Url_length);
        for(int i=0;i<Short_Url_length;i++){
            sb.append(Base62.charAt(SECURE_RANDOM.nextInt(62)));
        }
        return sb.toString();
    }
    public List<UrlMappingDTO> getUrlsByUser(User user){
        return urlMappingRepository.findByUser(user).stream().map(this::convertToDTO).toList();
    }
    public List<ClickEventDTO> getClickEventsByDate(String shortUrl,LocalDateTime startTime,LocalDateTime endTime){
        UrlMapping urlMapping=urlMappingRepository.findByShortUrl(shortUrl);
        if(urlMapping!=null) {
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
    public Map<LocalDate, Long> getTotalClicksByUserAndDate(User user, LocalDate startTime, LocalDate endTime) {
        List<UrlMapping> urlMappings = urlMappingRepository.findByUser(user);
        List<ClickEvents> clickEvents = clickEventRepository.findByUrlMappingInAndClickDateBetween(urlMappings, startTime.atStartOfDay(), endTime.plusDays(1).atStartOfDay());
        return clickEvents.stream()
                .collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate(), Collectors.counting()));
    }
    public UrlMapping getOriginalUrl(String shortUrl){
        UrlMapping urlMapping=urlMappingRepository.findByShortUrl(shortUrl);
        if(urlMapping != null) {
            urlMapping.setClickCount(urlMapping.getClickCount() + 1);
            urlMappingRepository.save(urlMapping);
            ClickEvents clickEvents = new ClickEvents();
            clickEvents.setClickDate(LocalDateTime.now());
            clickEvents.setUrlMapping(urlMapping);
            clickEventRepository.save(clickEvents);
        }
        return urlMapping;
    }
}
