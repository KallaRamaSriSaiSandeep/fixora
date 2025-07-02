-- Fixora Database Schema
-- Database: fix2

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS user_services;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'SERVICEPROVIDER') NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(255),
    fare DOUBLE,
    description TEXT,
    rating DOUBLE DEFAULT 0.0,
    completed_jobs INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_location (location)
);

-- Create user_services table (for service providers)
CREATE TABLE user_services (
    user_id BIGINT,
    service VARCHAR(100),
    PRIMARY KEY (user_id, service),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_service (service)
);

-- Create bookings table
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    service_provider_id BIGINT NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED') DEFAULT 'PENDING',
    fare DOUBLE NOT NULL,
    customer_name VARCHAR(255),
    provider_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_provider_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_customer (customer_id),
    INDEX idx_provider (service_provider_id),
    INDEX idx_status (status),
    INDEX idx_service_type (service_type),
    INDEX idx_scheduled_date (scheduled_date)
);

-- Insert sample users (customers)
INSERT INTO users (name, email, password, role, phone, location) VALUES
('Alice Johnson', 'alice@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CUSTOMER', '+1-555-0101', 'Downtown'),
('Bob Smith', 'bob@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CUSTOMER', '+1-555-0102', 'Uptown'),
('Carol Davis', 'carol@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CUSTOMER', '+1-555-0103', 'Midtown');

-- Insert sample service providers
INSERT INTO users (name, email, password, role, phone, location, fare, description, rating, completed_jobs) VALUES
('John Smith', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'SERVICEPROVIDER', '+1-234-567-8900', 'Downtown', 50.00, 'Experienced plumber with 10+ years of expertise in residential and commercial plumbing', 4.8, 150),
('Mike Johnson', 'mike@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'SERVICEPROVIDER', '+1-234-567-8901', 'Uptown', 60.00, 'Licensed electrician specializing in home and commercial electrical work', 4.9, 200),
('Sarah Wilson', 'sarah@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'SERVICEPROVIDER', '+1-234-567-8902', 'Midtown', 45.00, 'Skilled carpenter for all your woodworking needs', 4.7, 120),
('David Brown', 'david@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'SERVICEPROVIDER', '+1-234-567-8903', 'Downtown', 40.00, 'Professional painter with expertise in interior and exterior painting', 4.6, 90),
('Lisa Garcia', 'lisa@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'SERVICEPROVIDER', '+1-234-567-8904', 'Uptown', 35.00, 'Reliable cleaning service for homes and offices', 4.8, 180);

-- Insert services for service providers
INSERT INTO user_services (user_id, service) VALUES
(4, 'plumber'),
(5, 'electrician'),
(6, 'carpenter'),
(7, 'painter'),
(8, 'cleaner'),
(4, 'handyman'),
(6, 'handyman');

-- Insert sample bookings
INSERT INTO bookings (customer_id, service_provider_id, service_type, description, scheduled_date, status, fare, customer_name, provider_name) VALUES
(1, 4, 'plumber', 'Fix kitchen sink leak - urgent repair needed', '2025-01-15', 'PENDING', 50.00, 'Alice Johnson', 'John Smith'),
(2, 5, 'electrician', 'Install new ceiling fan in living room', '2025-01-16', 'ACCEPTED', 60.00, 'Bob Smith', 'Mike Johnson'),
(3, 6, 'carpenter', 'Build custom bookshelf for home office', '2025-01-18', 'PENDING', 45.00, 'Carol Davis', 'Sarah Wilson'),
(1, 7, 'painter', 'Paint bedroom walls - two coats needed', '2025-01-20', 'COMPLETED', 40.00, 'Alice Johnson', 'David Brown'),
(2, 8, 'cleaner', 'Deep cleaning of entire apartment', '2025-01-14', 'COMPLETED', 35.00, 'Bob Smith', 'Lisa Garcia');

-- Create indexes for better performance
CREATE INDEX idx_users_role_rating ON users(role, rating DESC);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX idx_bookings_customer_created ON bookings(customer_id, created_at DESC);
CREATE INDEX idx_bookings_provider_created ON bookings(service_provider_id, created_at DESC);

-- Sample data note: Password for all sample users is 'password' (hashed with BCrypt)
-- For testing purposes, you can login with:
-- Customer: alice@example.com / password
-- Service Provider: john@example.com / password