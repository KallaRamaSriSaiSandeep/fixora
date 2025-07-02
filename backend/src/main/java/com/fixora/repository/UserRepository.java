package com.fixora.repository;

import com.fixora.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(User.Role role);
    
    @Query("SELECT u FROM User u WHERE u.role = 'SERVICEPROVIDER' ORDER BY u.rating DESC, u.completedJobs DESC")
    List<User> findFeaturedServiceProviders();
    
    @Query("SELECT u FROM User u WHERE u.role = 'SERVICEPROVIDER' AND :service MEMBER OF u.services")
    List<User> findServiceProvidersByService(String service);
    
    @Query("SELECT u FROM User u WHERE u.role = 'SERVICEPROVIDER' AND u.location LIKE %:location%")
    List<User> findServiceProvidersByLocation(String location);
}