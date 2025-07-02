package com.fixora.service;

import com.fixora.entity.Booking;
import com.fixora.entity.User;
import com.fixora.repository.BookingRepository;
import com.fixora.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    public Booking save(Booking booking) {
        // Set customer and provider names for denormalization
        Optional<User> customer = userRepository.findById(booking.getCustomerId());
        Optional<User> provider = userRepository.findById(booking.getServiceProviderId());

        if (customer.isPresent()) {
            booking.setCustomerName(customer.get().getName());
        }
        if (provider.isPresent()) {
            booking.setProviderName(provider.get().getName());
        }

        return bookingRepository.save(booking);
    }

    public Optional<Booking> findById(Long id) {
        return bookingRepository.findById(id);
    }

    public List<Booking> findByCustomerId(Long customerId) {
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Booking> findByServiceProviderId(Long serviceProviderId) {
        return bookingRepository.findByServiceProviderIdOrderByCreatedAtDesc(serviceProviderId);
    }

    public List<Booking> findByStatus(Booking.Status status) {
        return bookingRepository.findByStatus(status);
    }

    public Booking updateStatus(Long bookingId, Booking.Status status) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus(status);
            
            // Update provider's completed jobs count if booking is completed
            if (status == Booking.Status.COMPLETED) {
                Optional<User> providerOpt = userRepository.findById(booking.getServiceProviderId());
                if (providerOpt.isPresent()) {
                    User provider = providerOpt.get();
                    provider.setCompletedJobs(provider.getCompletedJobs() + 1);
                    userRepository.save(provider);
                }
            }
            
            return bookingRepository.save(booking);
        }
        throw new RuntimeException("Booking not found with id: " + bookingId);
    }

    public Long countCompletedBookingsByServiceProvider(Long serviceProviderId) {
        return bookingRepository.countCompletedBookingsByServiceProvider(serviceProviderId);
    }
}