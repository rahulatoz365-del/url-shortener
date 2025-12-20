package org.url_shortener_spring.demo.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.url_shortener_spring.demo.models.UrlMapping;
import org.url_shortener_spring.demo.service.UrlMappingService;

@AllArgsConstructor
@RestController
public class RedirectController {
    private UrlMappingService urlMappingService;
    @GetMapping("/{shortUrl}")
    public ResponseEntity<Void> redirect(@PathVariable String shortUrl){
        UrlMapping urlMapping=urlMappingService.getOriginalUrl(shortUrl);
        if(urlMapping!=null){
            HttpHeaders httpHeaders=new HttpHeaders();
            httpHeaders.add("Location",urlMapping.getOriginalUrl());
            return ResponseEntity.status(302).headers(httpHeaders).build();
        }
        else{
            return ResponseEntity.notFound().build();
        }
    }
}
