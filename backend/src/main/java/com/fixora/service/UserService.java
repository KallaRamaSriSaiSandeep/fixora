package com.fixora.service;

import com.fixora.entity.User;
import com.fixora.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        UserBuilder builder = org.springframework.security.core.userdetails.User.withUsername(email);
        builder.password(user.getPassword());
        builder.roles(user.getRole().toString());
        return builder.build();
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public List<User> findAllServiceProviders() {
        return userRepository.findByRole(User.Role.SERVICEPROVIDER);
    }

    public List<User> findFeaturedServiceProviders() {
        return userRepository.findFeaturedServiceProviders();
    }

    public List<User> findServiceProvidersByService(String service) {
        return userRepository.findServiceProvidersByService(service);
    }

    public List<User> findServiceProvidersByLocation(String location) {
        return userRepository.findServiceProvidersByLocation(location);
    }
}