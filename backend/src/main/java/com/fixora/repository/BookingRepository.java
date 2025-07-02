package com.fixora.repository;

import com.fixora.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerId(Long customerId);
    
    List<Booking> findByServiceProviderId(Long serviceProviderId);
    
    List<Booking> findByStatus(Booking.Status status);
    
    @Query("SELECT b FROM Booking b WHERE b.customerId = :customerId ORDER BY b.createdAt DESC")
    List<Booking> findByCustomerIdOrderByCreatedAtDesc(@Param("customerId") Long customerId);
    
    @Query("SELECT b FROM Booking b WHERE b.serviceProviderId = :serviceProviderId ORDER BY b.createdAt DESC")
    List<Booking> findByServiceProviderIdOrderByCreatedAtDesc(@Param("serviceProviderId") Long serviceProviderId);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.serviceProviderId = :serviceProviderId AND b.status = 'COMPLETED'")
    Long countCompletedBookingsByServiceProvider(@Param("serviceProviderId") Long serviceProviderId);
}