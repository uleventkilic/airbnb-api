# Airbnb API Project

This project is a RESTful API providing functionality for an Airbnb-like platform. It includes property listing, guest booking, host management, and admin operations. Built using Node.js and Express, it integrates MongoDB for data persistence and provides secure user authentication with JWT.

---

## **Project Links**

- **Source Code**: [GitHub Repository](https://github.com/uleventkilic/airbnb-api)
- **Live API Deployment**: [Airbnb API on Render](https://airbnb-api-77ly.onrender.com/api/v1/docs)

---

## **Presentation Links**

- **Source Code Presentation**: [Youtube Video](https://youtu.be/yNECydKwhkI)
- **Testing Presentation**: [Youtube Video](https://youtu.be/8ilBsy2N8Vs)

---

## **Features**

### **Admin Features**
- View and filter property listings by country, city, and ratings.
- Access only via secure login using the `/admin` endpoints.

### **Host Features**
- Add and manage property listings.
- Provide essential details like title, price, location, and availability.

### **Guest Features**
- Search for available properties using filters such as date range and number of people.
- Book stays for selected listings.
- Add reviews for properties they’ve stayed in, accessible only to guests who completed bookings.

---

## **Authentication**

This project uses role-based authentication secured with JWT.

### **Roles and Login Credentials**
- **Admin**
  - **Email**: `admin@example.com`
  - **Password**: `admin123`
- **Host**
  - **Email**: `host@example.com`
  - **Password**: `host123`
- **Guest**
  - **Email**: `guest@example.com`
  - **Password**: `guest123`

### **Authentication Endpoints**
- **Login**: `/api/v1/auth/login`
  - Generates a JWT token to access role-based functionalities.
- **Token Usage**: Include the token in the `Authorization` header as a Bearer Token.

---

## **System Design Overview**

The system is designed to be modular and scalable with the following components:

### **API Layer**
- Built with Express.js for efficient routing and middleware.
- Includes endpoints for admin, host, and guest operations.

### **Database Layer**
- MongoDB for storing and managing application data.
- Collections:
  - `users`: Stores admin, host, and guest user details.
  - `listings`: Maintains property listings added by hosts.
  - `bookings`: Tracks guest reservations for listings.
  - `reviews`: Stores reviews provided by guests.

### **Authentication**
- JWT-based authentication for secure API access.
- Role-based access control for Admin, Host, and Guest roles.

### **Documentation**
- Integrated Swagger UI at `/api/v1/docs` for interactive API testing.

---

## **Entity-Relationship (ER) Diagram**

ER diagram representing the data structure for this project:

![Entity-Relationship Diagram](https://raw.githubusercontent.com/uleventkilic/airbnb-api/main/ER.png)

---

## **Design Choices**

- **Pagination**: Implemented to handle large datasets efficiently in listing operations.
- **Error Handling**: Centralized error handling provides meaningful feedback to users and developers.
- **Swagger Integration**: Ensures an interactive and detailed API testing environment.

---

## **Assumptions**

1. **Authentication**
   - Admins have exclusive access to `/admin` endpoints to view and filter listings, as well as manage reviews and user roles.
   - Hosts can manage their property listings via `/hosts` endpoints, including adding, editing, and removing properties.
   - Guests can search available listings, make bookings, and add reviews through `/guests` endpoints.
   - JWT-based authentication is required for all endpoints except public listing searches.

2. **Environment Variables**
   - Sensitive configurations such as `MONGO_URI` (for MongoDB connection) and `JWT_SECRET` (for token generation) are stored securely in a `.env` file.
   - Deployment-specific settings, including the API base URL and cloud storage credentials, are also managed via environment variables.

3. **Default Pagination**
   - Listings and reviews are paginated for efficient data retrieval, with default values of:
     - `page = 1`
     - `limit = 10`
   - These parameters can be customized via query strings for better client control.

4. **Data Validation**
   - All incoming requests are validated to ensure mandatory fields are provided.
   - Fields like `email` are checked for proper format, and fields such as `price` are validated to ensure they are numeric and positive.

5. **Error Handling**
   - The API provides detailed error messages for client-side and server-side issues.
   - Common errors include invalid tokens, missing fields, and unauthorized access, all of which are returned with appropriate HTTP status codes.

6. **Date Validation**
   - Bookings and availability dates are validated to ensure logical consistency:
     - `dateFrom` should precede or equal `dateTo`.
     - Dates cannot overlap with existing bookings for the same listing.

---

## **Issues Encountered**

### **1. CORS Errors**
- **Issue**: Cross-origin requests caused issues in Swagger UI testing.
- **Solution**: Added CORS middleware to allow cross-origin requests, ensuring compatibility across local and deployed environments.

### **2. Deployment Challenges**
- **Issue**: Environment variables like `JWT_SECRET` and `MONGO_URI` were missing during deployment, causing application crashes on Render.
- **Solution**: Configured variables directly in Render's dashboard and verified deployment logs for accurate debugging.

### **3. Pagination Handling**
- **Issue**: Incorrect handling of `offset` and `limit` parameters in listing queries caused inconsistent results for paginated endpoints.
- **Solution**: Fixed pagination logic by dynamically calculating the correct offset and limit for each request.

### **4. Token Expiry Issues**
- **Issue**: Expired JWT tokens were not properly handled, leading to unclear error messages.
- **Solution**: Added token expiry validation and improved error messaging for better developer and user clarity.

### **5. Duplicate Key Error**
- **Issue**: Duplicate key errors occurred when seeding the database with default users due to existing entries.
- **Solution**: Implemented a check to clear or skip existing users before seeding new ones.

### **6. Date Validation**
- **Issue**: Some endpoints accepted invalid date formats, causing unpredictable behavior in the database queries.
- **Solution**: Added validation middleware to ensure date formats adhere to ISO standards and reject malformed inputs.

### **7. Swagger Integration Issues**
- **Issue**: Swagger documentation failed to load on the deployed version due to incorrect base URL configuration.
- **Solution**: Updated the Swagger `servers` configuration to dynamically match the environment, ensuring compatibility with both local and deployed setups.

### **8. Review Access Control**
- **Issue**: Guests were able to leave reviews without completing a stay, compromising the integrity of the system.
- **Solution**: Added a backend check to validate if the user had a completed booking before allowing them to submit a review.


---

## **API Endpoints Overview**

### **Admin Endpoints**
1. **Filter Listings**
   - **Method**: `GET`
   - **Endpoint**: `/api/v1/admin/listings`
   - **Parameters**:
     - `country`: Filter by country.
     - `city`: Filter by city.
     - `page`: Page number.
     - `limit`: Number of listings per page.
     

### **Host Endpoints**
1. **Add Listing**
   - **Method**: `POST`
   - **Endpoint**: `/api/v1/hosts/listings`
   - **Request Body**:
     ```json
     {
       "noOfPeople": 4,
       "country": "Turkey",
       "city": "Istanbul",
       "price": 200
     }
     ```

### **Guest Endpoints**
1. **Search Listings**
   - **Method**: `GET`
   - **Endpoint**: `/api/v1/guests/listings`
   - **Parameters**:
     - `dateFrom`: Start date for availability.
     - `dateTo`: End date for availability.
     - `noOfPeople`: Number of people.
     - `country`: Filter by country.
     - `city`: Filter by city.
     - `page`: Page number.
     - `limit`: Number of listings per page.

2. **Make Booking**
   - **Method**: `POST`
   - **Endpoint**: `/api/v1/guests/bookings`
   - **Request Body**:
     ```json
     {
        "listingId": "64f2b8c8f1c84900123abcde",
       "dateFrom": "2024-01-05",
       "dateTo": "2024-01-10",
       "namesOfPeople": ["John Doe", "Jane Smith"]
     }
     ```

3. **Add Review**
   - **Method**: `POST`
   - **Endpoint**: `/api/v1/guests/reviews`
   - **Request Body**:
     ```json
     {
       "bookingId": "64f2b8c8f1c84900123abcde",
       "rating": 5,
       "comment": "The stay was fantastic!"
     }
     ```

---
