# Use OpenJDK 17 slim image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Install Maven
RUN apt-get update && \
    apt-get install -y maven && \
    rm -rf /var/lib/apt/lists/*

# Copy Maven wrapper and project files
COPY .mvn .mvn
COPY mvnw pom.xml ./

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy all source files
COPY . .

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose the port your Spring Boot app runs on
EXPOSE 9098

# Run the JAR
CMD ["java", "-jar", "$(find target -name '*-SNAPSHOT.jar' | head -n 1)"]
