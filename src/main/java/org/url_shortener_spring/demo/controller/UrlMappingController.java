package org.url_shortener_spring.demo.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.url_shortener_spring.demo.dtos.ClickEventDTO;
import org.url_shortener_spring.demo.dtos.UrlMappingDTO;
import org.url_shortener_spring.demo.models.User;
import org.url_shortener_spring.demo.service.UrlMappingService;
import org.url_shortener_spring.demo.service.UserService;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.SimpleTimeZone;

@RestController
@RequestMapping("/api/urls")
@AllArgsConstructor
public class UrlMappingController {
    private UrlMappingService urlMappingService;
    private UserService userService;
    @PostMapping("/shorten")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UrlMappingDTO> createShortUrl(@RequestBody Map<String,String> request, Principal principal){
        String originalUrl=request.get("originalUrl");
        User user=userService.findByUsername(principal.getName());
        UrlMappingDTO urlMappingDTO=urlMappingService.createShortUrl(originalUrl,user);
        return ResponseEntity.ok(urlMappingDTO);
    }
    @GetMapping("/myurls")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ClickEventDTO>> getUrlAnalytics(@PathVariable String shortUrl,@RequestParam("StartDate")String start,@RequestParam("endDate") String end){
        DateTimeFormatter formatter=DateTimeFormatter.ISO_DATE_TIME;
        LocalDateTime startDate=LocalDateTime.parse(start,formatter);
        LocalDateTime endDate=LocalDateTime.parse(end,formatter);
        List<ClickEventDTO> clickEventDTOS=urlMappingService.getClickEventsByDate(shortUrl,startDate,endDate);
        return ResponseEntity.ok(clickEventDTOS);
    }
    @GetMapping("/totalClicks")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<LocalDate,Long>> getTotalClicks(Principal principal, @RequestParam("StartDate")String start, @RequestParam("endDate") String end){
        DateTimeFormatter formatter=DateTimeFormatter.ISO_DATE_TIME;
        User user=userService.findByUsername(principal.getName());
        LocalDate startDate=LocalDate.parse(start,formatter);
        LocalDate endDate=LocalDate.parse(end,formatter);
        Map<LocalDate,Long> totalClicks=urlMappingService.getTotalClicksByUserAndDate(user,startDate,endDate);
        return ResponseEntity.ok(totalClicks);
    }
}
