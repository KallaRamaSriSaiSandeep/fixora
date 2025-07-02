# Fixora Backend - Spring Boot Application

This is the backend service for the Fixora service provider platform built with Spring Boot.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Database Setup

1. Create a MySQL database named `fix2`:
```sql
CREATE DATABASE fix2;
```

2. Update the database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/fix2
spring.datasource.username=root
spring.datasource.password=Sandeep4833@
```

3. The application will automatically create the required tables on startup.

## Running the Application

1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the application using Maven:
```bash
mvn spring-boot:run
```

The application will start on port 9098.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires JWT token)

### Service Providers
- `GET /api/providers` - Get all service providers
- `GET /api/providers/featured` - Get featured service providers
- `GET /api/providers/{id}` - Get specific provider
- `PUT /api/providers/{id}` - Update provider profile

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/customer/{customerId}` - Get bookings for a customer
- `GET /api/bookings/provider/{providerId}` - Get bookings for a provider
- `PUT /api/bookings/{id}/status` - Update booking status

## Project Structure

```
backend/
├── src/main/java/com/fixora/
│   ├── config/
│   │   ├── WebConfig.java
│   │   ├── JwtConfig.java
│   │   └── SecurityConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── ProviderController.java
│   │   └── BookingController.java
│   ├── entity/
│   │   ├── User.java
│   │   └── Booking.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   └── BookingRepository.java
│   ├── service/
│   │   ├── UserService.java
│   │   ├── JwtService.java
│   │   └── BookingService.java
│   ├── dto/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   └── BookingRequest.java
│   └── FixoraApplication.java
└── src/main/resources/
    └── application.properties
```

## Security

- JWT-based authentication
- CORS configured to allow requests from http://localhost:5173
- Password encryption using BCrypt
- Role-based access control (CUSTOMER, SERVICEPROVIDER)

## Database Schema

The application uses the following main entities:

### Users Table
- id (Primary Key)
- name
- email (Unique)
- password (Encrypted)
- role (CUSTOMER, SERVICEPROVIDER)
- phone
- location
- services (JSON for service providers)
- fare (for service providers)
- description (for service providers)
- rating
- completed_jobs
- created_at
- updated_at

### Bookings Table
- id (Primary Key)
- customer_id (Foreign Key)
- service_provider_id (Foreign Key)
- service_type
- description
- scheduled_date
- status (PENDING, ACCEPTED, REJECTED, COMPLETED)
- fare
- created_at
- updated_at