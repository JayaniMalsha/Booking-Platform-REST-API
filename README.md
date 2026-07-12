# Booking Platform REST API

A production-ready RESTful API built with **NestJS**, **TypeORM**, and **SQLite/PostgreSQL** for managing bookable services and customer appointments. Supports JWT-based authentication with refresh token rotation, full CRUD operations, pagination, filtering, and Swagger documentation.

---

## Project Overview

This API powers a service booking platform where:

- **Customers** can browse available services and create bookings without authentication.
- **Admins / Staff** can register, log in, manage services, view all bookings, update booking statuses, and cancel bookings — all protected behind JWT Bearer authentication.

### Key Features

| Feature | Details |
|---|---|
| Authentication | JWT access tokens (15 min) + refresh token rotation (7 days) |
| Services | Full CRUD — create, list, update, delete |
| Bookings | Create (public), list with filters & pagination, update status, cancel |
| Database | SQLite for development, PostgreSQL for production |
| Migrations | TypeORM migration system (no `synchronize: true` in production) |
| Validation | Class-validator with whitelist & transform pipes |
| Docs | Interactive Swagger UI at `/api/docs` |

---

## Installation Steps

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- *(Optional for PostgreSQL)* A running PostgreSQL instance

### Steps

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd booking-platform-rest-api

# 2. Install dependencies
npm install

# 3. Set up environment variables (see section below)
cp .env.example .env
# Then edit .env with your own values

# 4. Run database migrations (required before first start)
npm run migration:run

# 5. Start the server
npm run start:dev
```

The API will be available at `http://localhost:3001/api`.  
Interactive docs are at `http://localhost:3001/api/docs`.

---

## Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

```dotenv
# Application
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_access_token_key_change_me_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key_change_me_in_production
JWT_REFRESH_EXPIRES_IN=7d

# Database: set to 'sqlite' or 'postgres'
DB_TYPE=sqlite

# SQLite (used when DB_TYPE=sqlite)
DB_DATABASE=booking_db.sqlite

# PostgreSQL (used when DB_TYPE=postgres)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=booking_platform
```

> **Important:** Never commit your real `.env` file. Use `.env.example` as the template.

---

## Database Setup

This project uses **TypeORM migrations** instead of `synchronize: true` to safely manage database schema changes.

### SQLite (default — development)

No additional setup is needed. The `booking_db.sqlite` file will be created automatically when you run migrations.

### PostgreSQL (production)

1. Create the database:
   ```sql
   CREATE DATABASE booking_platform;
   ```
2. Update the `DB_*` environment variables in your `.env`.
3. Set `DB_TYPE=postgres`.

---

## Running Migrations

Migrations are required to create the database schema before the application can start.

```bash
# Apply all pending migrations (run this on first setup and after schema changes)
npm run migration:run

# Generate a new migration after changing an entity
npm run migration:generate

# Roll back the last applied migration
npm run migration:revert
```

> **Note:** The `migration:generate` command compares your current entity definitions against the live database schema and creates a new migration file in `src/migrations/` with only the differences.

---

## Running the Application

```bash
# Development (hot-reload)
npm run start:dev

# Standard start
npm run start

# Production
npm run start:prod
```

---

## Running Tests

```bash
# Unit tests
npm run test

# Unit tests with coverage report
npm run test:cov

# End-to-end tests
npm run test:e2e

# Watch mode
npm run test:watch
```

---

## API Documentation

### Interactive Swagger UI

After starting the server, navigate to:

```
http://localhost:3001/api/docs
```

All endpoints are documented with request/response schemas, required fields, and example values.

---

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register a new user account |
| POST | `/api/auth/login` | Public | Login and receive access + refresh tokens |
| POST | `/api/auth/refresh` | Public | Rotate tokens using a valid refresh token |

**Login Response Example:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Services Endpoints (`/api/services`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/services` | Public | List all services (paginated, filter by `isActive`) |
| GET | `/api/services/:id` | Public | Get details of a specific service |
| POST | `/api/services` | Bearer JWT | Create a new service |
| PUT | `/api/services/:id` | Bearer JWT | Update an existing service |
| DELETE | `/api/services/:id` | Bearer JWT | Delete a service |

**Query Parameters for `GET /api/services`:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `isActive` (boolean, optional)

---

### Bookings Endpoints (`/api/bookings`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings` | Public | Create a new booking |
| GET | `/api/bookings` | Bearer JWT | List all bookings (paginated, filterable) |
| GET | `/api/bookings/:id` | Bearer JWT | Get a specific booking by ID |
| PATCH | `/api/bookings/:id/status` | Bearer JWT | Update booking status |
| DELETE | `/api/bookings/:id` | Bearer JWT | Cancel a booking |

**Booking Status Values:** `pending` | `confirmed` | `cancelled` | `completed`

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

## Assumptions Made

1. **Single-role authentication:** All authenticated users share the same admin/staff role. There is no separate customer login — customers submit bookings directly with their personal details.
2. **No double-booking enforcement at the database level:** The service prevents duplicate bookings for the same service, date, and time at the application layer via a uniqueness check before inserting.
3. **Soft cancel, not hard delete:** The `DELETE /bookings/:id` endpoint sets the booking status to `cancelled` rather than removing the record, preserving an audit trail.
4. **UUID primary keys:** All entities use UUID v4 as primary keys for security (non-sequential, non-enumerable IDs).
5. **Refresh token hashing:** Refresh tokens are hashed with `bcrypt` before storage; the raw token is only returned once at login time.
6. **SQLite as the default:** SQLite is used for local development to reduce setup friction. The codebase is environment-driven and switches to PostgreSQL when `DB_TYPE=postgres`.

---

## Future Improvements

- **Role-Based Access Control (RBAC):** Introduce `admin` and `staff` roles with fine-grained permissions.
- **Email Notifications:** Send booking confirmation and status-change emails to customers via a service like SendGrid or Nodemailer.
- **Recurring Bookings:** Allow customers to set up weekly or monthly repeating appointments.
- **Service Availability Windows:** Define per-service working hours and block bookings outside those windows.
- **Rate Limiting:** Add `@nestjs/throttler` to protect public endpoints from abuse.
- **Soft Delete:** Use TypeORM's `@DeleteDateColumn` for true soft-delete across all entities.
- **Admin Dashboard:** A companion React/Next.js front end for visualising booking statistics and managing services.
- **Docker Compose (Production):** Extend `docker-compose.yml` with a production profile using PostgreSQL with persistent volumes.
- **CI/CD Pipeline:** Add GitHub Actions to run tests and lint on every pull request.

---

## Docker Support

A `Dockerfile` and `docker-compose.yml` are included for containerised development.

```bash
# Build and start containers
docker-compose up --build
```

---

## License

UNLICENSED — proprietary project.
