package com.example.demo;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000","https://billit-clean.onrender.com") // Consente tutte le origini
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Metodi HTTP permessi
                .allowedHeaders("*") // Tutti gli header
                .allowCredentials(false); // Disabilita credenziali per compatibilità con "*"
    }
}