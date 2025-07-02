package com.fixora.controller;

import com.fixora.entity.User;
import com.fixora.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "http://localhost:5174")
public class ProviderController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllProviders() {
        List<User> providers = userService.findAllServiceProviders();
        return ResponseEntity.ok(providers);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<User>> getFeaturedProviders() {
        List<User> providers = userService.findFeaturedServiceProviders();
        return ResponseEntity.ok(providers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProvider(@PathVariable Long id) {
        Optional<User> provider = userService.findById(id);
        if (provider.isPresent() && provider.get().getRole() == User.Role.SERVICEPROVIDER) {
            return ResponseEntity.ok(provider.get());
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Service provider not found");
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchProviders(
            @RequestParam(required = false) String service,
            @RequestParam(required = false) String location) {
        
        List<User> providers;
        
        if (service != null && !service.isEmpty()) {
            providers = userService.findServiceProvidersByService(service);
        } else if (location != null && !location.isEmpty()) {
            providers = userService.findServiceProvidersByLocation(location);
        } else {
            providers = userService.findAllServiceProviders();
        }
        
        return ResponseEntity.ok(providers);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProvider(@PathVariable Long id, @RequestBody User updatedProvider) {
        try {
            // Verify the user is authenticated and updating their own profile
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (!currentUser.getId().equals(id)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Unauthorized to update this profile");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            }

            Optional<User> providerOpt = userService.findById(id);
            if (providerOpt.isPresent()) {
                User provider = providerOpt.get();
                
                // Update allowed fields
                provider.setName(updatedProvider.getName());
                provider.setPhone(updatedProvider.getPhone());
                provider.setLocation(updatedProvider.getLocation());
                provider.setServices(updatedProvider.getServices());
                provider.setFare(updatedProvider.getFare());
                provider.setDescription(updatedProvider.getDescription());
                
                User savedProvider = userService.save(provider);
                return ResponseEntity.ok(savedProvider);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Service provider not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update provider: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}