# Booking Platform REST API

A production-ready RESTful API built with **NestJS**, **TypeORM**, and **SQLite** for managing bookable services and customer appointments. The API supports JWT-based authentication with refresh token rotation, full CRUD operations, pagination, filtering, validation, and Swagger API documentation.

---

## Project Overview

This API powers a service booking platform where:

* **Customers** can browse available services and create bookings without authentication.
* **Admins / Staff** can register, log in, manage services, view all bookings, update booking statuses, and cancel bookings.
* Protected endpoints use **JWT Bearer authentication**.
* **SQLite** is used as the database for local development.

### Key Features

| Feature           | Details                                                                |
| ----------------- | ---------------------------------------------------------------------- |
| Authentication    | JWT access tokens (15 min) + refresh token rotation (7 days)           |
| Services          | Full CRUD — create, list, update, delete                               |
| Bookings          | Create (public), list with filters & pagination, update status, cancel |
| Database          | SQLite with TypeORM                                                    |
| Migrations        | TypeORM migration system for database schema management                |
| Validation        | Class-validator with whitelist & transform pipes                       |
| API Documentation | Interactive Swagger UI at `/api/docs`                                  |
| API Architecture  | Modular NestJS REST API                                                |
| Containerization  | Docker and Docker Compose support                                      |

## Installation Steps

### Prerequisites

* **Node.js** v18 or later
* **npm** v9 or later

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/JayaniMalsha/Booking-Platform-REST-API.git
cd Booking-Platform-REST-API

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env

# 4. Configure the environment variables
# Edit .env and add your own JWT secrets

# 5. Run database migrations
npm run migration:run

# 6. Start the development server
npm run start:dev
```

The API will be available at:

```text
http://localhost:3001/api
```

Interactive Swagger API documentation:

```text
http://localhost:3001/api/docs
```

---

## Environment Variables

Create a `.env` file from the provided `.env.example` file:

```bash
cp .env.example .env
```

Then configure the following variables:

```dotenv
PORT=3001
NODE_ENV=development

JWT_SECRET=your_jwt_access_secret
JWT_EXPIRES_IN=15m

JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

DB_TYPE=sqlite
DB_DATABASE=booking_db.sqlite
```

---

## Database Setup

This project uses **SQLite** with **TypeORM**.

TypeORM migrations are used to create and manage the database schema.

Run the following command before starting the application:

```bash
npm run migration:run
```

The `booking_db.sqlite` database file will be created automatically.

## Database Migrations

Run the following command to create the database schema:

```bash
npm run migration:run
```

Other migration commands:

```bash
# Generate a new migration after changing entities
npm run migration:generate

# Revert the last migration
npm run migration:revert
```

---

## Running the Application

```bash
# Development
npm run start:dev

# Standard
npm run start

# Production
npm run start:prod
```

## Running Tests

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:cov

# Run end-to-end tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

---

## API Documentation

### Swagger UI

Start the application and open:

```text
http://localhost:3001/api/docs
```

Swagger provides interactive API documentation with endpoint details, request/response schemas, authentication requirements, and example values.

### Authentication Endpoints

| Method | Endpoint             | Auth   | Description                                 |
| ------ | -------------------- | ------ | ------------------------------------------- |
| POST   | `/api/auth/register` | Public | Register a new user account                 |
| POST   | `/api/auth/login`    | Public | Login and receive access and refresh tokens |
| POST   | `/api/auth/refresh`  | Public | Refresh and rotate authentication tokens    |

### Services Endpoints

| Method | Endpoint            | Auth       | Description                                 |
| ------ | ------------------- | ---------- | ------------------------------------------- |
| GET    | `/api/services`     | Public     | List services with pagination and filtering |
| GET    | `/api/services/:id` | Public     | Get a specific service                      |
| POST   | `/api/services`     | Bearer JWT | Create a service                            |
| PUT    | `/api/services/:id` | Bearer JWT | Update a service                            |
| DELETE | `/api/services/:id` | Bearer JWT | Delete a service                            |

**Query parameters for `GET /api/services`:**

* `page` — page number (default: `1`)
* `limit` — number of results per page (default: `10`)
* `isActive` — filter by service availability (`true`/`false`)
---

### Bookings Endpoints

| Method | Endpoint                   | Auth       | Description                                   |
| ------ | -------------------------- | ---------- | --------------------------------------------- |
| POST   | `/api/bookings`            | Public     | Create a new booking                          |
| GET    | `/api/bookings`            | Bearer JWT | List all bookings with pagination and filters |
| GET    | `/api/bookings/:id`        | Bearer JWT | Get a specific booking                        |
| PATCH  | `/api/bookings/:id/status` | Bearer JWT | Update booking status                         |
| DELETE | `/api/bookings/:id`        | Bearer JWT | Cancel a booking                              |

**Booking Status Values:** `pending` · `confirmed` · `cancelled` · `completed`

**Create Booking Request Body:**

```json
{
  "customerName": "Jane Doe",
  "customerEmail": "jane@example.com",
  "customerPhone": "+1234567890",
  "serviceId": "uuid-of-service",
  "bookingDate": "2026-08-01",
  "bookingTime": "10:00",
  "notes": "First appointment"
}
```

---

## Assumptions

1. Customers can create bookings without an account.
2. Authenticated users can manage services and bookings.
3. Duplicate bookings for the same service, date, and time are checked at the application level.
4. Cancelling a booking changes its status to `cancelled` instead of deleting the record.
5. Entities use UUID v4 primary keys.
6. Refresh tokens are securely hashed before being stored.

---

## Future Improvements

* Role-based access control (RBAC)
* Email notifications for booking confirmations and status updates
* Recurring bookings
* Service availability and working hours
* API rate limiting
* Admin dashboard
* CI/CD with GitHub Actions
* Production Docker configuration

---

## Docker Support

Docker and Docker Compose configuration are included for containerized development.

```bash
docker-compose up --build
```
