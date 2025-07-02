# Fixora - Full-Stack Service Provider Platform

Fixora is a comprehensive service provider platform that connects customers with skilled professionals for various home and business services.

## Features

### 🏠 **Frontend (React + TypeScript)**
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Smooth Animations**: Framer Motion for micro-interactions
- **Role-Based Authentication**: Separate dashboards for customers and service providers
- **Real-time Data**: Live updates with MySQL integration
- **Advanced Filtering**: Search by service type, location, and price

### 🔧 **Customer Features**
- Browse and search service providers
- Filter by service type, location, and pricing
- Book services with detailed descriptions
- Track booking status and history
- Responsive design for all devices

### 👷 **Service Provider Features**
- Manage incoming booking requests
- Accept or reject bookings
- Update profile and service offerings
- Track completed jobs and ratings
- Real-time dashboard analytics

### ⚡ **Backend (Spring Boot)**
- **JWT Authentication**: Secure token-based authentication
- **RESTful APIs**: Clean, well-documented API endpoints
- **Role-Based Access**: Customer and ServiceProvider roles
- **MySQL Integration**: Real-time data persistence
- **CORS Support**: Configured for frontend integration

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API communication

### Backend
- **Spring Boot 3.2.1**
- **Spring Security** with JWT
- **Spring Data JPA**
- **MySQL 8.0+**
- **Maven** for dependency management

### Database
- **MySQL** with optimized schema
- **JPA/Hibernate** for ORM
- **Indexed tables** for performance

## Quick Start

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.6+
- MySQL 8.0+

### 1. Database Setup
```sql
-- Create database
CREATE DATABASE fix2;

-- Import the schema
mysql -u root -p fix2 < database/fix2.sql
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Update database credentials in src/main/resources/application.properties
spring.datasource.username=root
spring.datasource.password=Sandeep4833@

# Run the application
mvn spring-boot:run
```
Backend will start on `http://localhost:9098`

### 3. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend will start on `http://localhost:5173`

## Sample Accounts

### Customers
- **Email**: alice@example.com | **Password**: password
- **Email**: bob@example.com | **Password**: password

### Service Providers
- **Email**: john@example.com | **Password**: password (Plumber)
- **Email**: mike@example.com | **Password**: password (Electrician)
- **Email**: sarah@example.com | **Password**: password (Carpenter)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Service Providers
- `GET /api/providers` - Get all providers
- `GET /api/providers/featured` - Get featured providers
- `PUT /api/providers/{id}` - Update provider profile

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/customer/{id}` - Get customer bookings
- `GET /api/bookings/provider/{id}` - Get provider bookings
- `PUT /api/bookings/{id}/status` - Update booking status

## Project Structure

```
Fixora/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main app component
│   └── package.json
├── backend/                 # Spring Boot application
│   ├── src/main/java/com/fixora/
│   │   ├── controller/     # REST controllers
│   │   ├── service/        # Business logic
│   │   ├── entity/         # JPA entities
│   │   ├── repository/     # Data repositories
│   │   ├── dto/           # Data transfer objects
│   │   └── config/        # Configuration classes
│   └── pom.xml
├── database/
│   └── fix2.sql           # Database schema and sample data
└── README.md
```

## Key Features Implementation

### 🔐 **Security**
- JWT-based authentication
- Password encryption with BCrypt
- Role-based access control
- CORS configuration for cross-origin requests

### 📱 **Responsive Design**
- Mobile-first approach
- Tailwind CSS breakpoints
- Touch-friendly interfaces
- Optimized for all screen sizes

### 🎨 **Modern UI/UX**
- Gradient color schemes
- Smooth animations and transitions
- Loading states and error handling
- Intuitive navigation patterns

### 📊 **Real-time Data**
- Live booking updates
- Instant status changes
- Real-time dashboard metrics
- Persistent data storage

## Development Notes

- **CORS**: Backend configured to allow requests from `http://localhost:5173`
- **JWT**: Tokens expire in 24 hours (configurable)
- **Database**: Auto-creates tables on first run
- **Sample Data**: Pre-loaded with test users and bookings

## Production Deployment

### Backend
1. Update `application.properties` for production database
2. Build: `mvn clean package`
3. Deploy JAR file to server
4. Ensure MySQL is accessible

### Frontend
1. Update API base URL for production
2. Build: `npm run build`
3. Deploy `dist` folder to web server
4. Configure routing for SPA

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using React, Spring Boot, and MySQL**