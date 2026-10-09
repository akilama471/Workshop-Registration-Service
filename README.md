# Workshop Registration Service

A full-stack workshop registration system built with Laravel 12, React, and Inertia.js.

## Prerequisites
- PHP 8.2+
- Node.js (v18+)
- Composer

## Setup Instructions

1. **Clone the repository** (or extract the zip):
   ```bash
   git clone <repo-url>
   cd workshop-registration-service
   ```

2. **Install PHP dependencies**:
   ```bash
   composer install
   ```

3. **Install Node dependencies**:
   ```bash
   npm install
   ```

4. **Environment Configuration**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Note: By default, Laravel uses SQLite. The `.env` file should have `DB_CONNECTION=sqlite`. Ensure you create a `database/database.sqlite` file or let the migration command create it.*

5. **Run Migrations and Seed the Database**:
   This step will create the database schema, insert the initial roles (Admin, Manager, Staff), create a seeded Admin user, and populate sample workshops.
   ```bash
   php artisan migrate:fresh --seed
   ```

6. **Start the Development Servers**:
   You can start both the Vite development server and the Laravel local development server simultaneously:
   ```bash
   npm run dev
   ```
   Or separately:
   ```bash
   php artisan serve
   npm run dev
   ```

## Seeded Dev Credentials

To access the system, you can use the following seeded Admin account:

- **Email:** `admin@example.com`
- **Password:** `password`

## Features Implemented
- Strict Role-Based Access Control (RBAC) via `spatie/laravel-permission` (Admin, Manager, Staff).
- Workshop Catalogue (List, filter by status).
- Workshop Management (Add, Edit) - Manager only.
- Attendee Registration with pessimistic database locking to strictly prevent over-registration.
- Registration Cancellation.
- Full Registration History (Audit Trail) showing who registered/cancelled and when.
- Scheduled task (`workshops:complete-past`) to mark past workshops as completed automatically.

See `ARCHITECTURE.md` for more details on stack choices, design decisions, and trade-offs.
