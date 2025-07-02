# Start from a Java base image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy pom.xml and install dependencies (for caching)
COPY pom.xml ./
COPY mvnw ./
COPY .mvn .mvn
RUN ./mvnw dependency:go-offline

# Copy the full source code
COPY . .

# Package the Spring Boot app
RUN ./mvnw clean package -DskipTests

# Run the jar file
CMD ["java", "-jar", "target/*.jar"]
