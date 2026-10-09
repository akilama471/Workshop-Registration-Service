# Workshop Registration Service - Architecture & Design Decisions

## Stack Choices and Why
- **Backend:** Laravel 12 (PHP)
  - **Why:** The project requires a robust backend with rapid development capabilities. Laravel provides built-in routing, validation, ORM (Eloquent), and authentication (via Breeze), which significantly accelerates development within a 3-hour limit.
- **Frontend:** React.js with Inertia.js
  - **Why:** Inertia allows building a modern, single-page application (SPA) experience using React without the complexity of client-side routing or building a standalone API. It seamlessly bridges the Laravel backend and React frontend.
- **UI/Styling:** Tailwind CSS (v4) with Headless UI/Breeze components
  - **Why:** Rapid UI development with predefined design tokens. I skipped Shadcn UI due to installation timeouts and instead adapted the robust Tailwind components provided by Laravel Breeze, styled with the strict required color palette (`#3f51b5`, `#303f9f`, etc.).

## Design Decisions
1. **Action Classes (Domain-Driven):** 
   Business logic (like registering an attendee or creating a workshop) was extracted from controllers into dedicated Action classes (e.g., `RegisterAttendeeAction`). This keeps controllers thin, makes business logic reusable, and simplifies testing.
2. **Access Control (Spatie Permissions):**
   `spatie/laravel-permission` was used for Role-Based Access Control (RBAC). It's robust and integrates seamlessly with Laravel Gates, enabling UI components and backend routes to be conditionally rendered/accessed based on user roles (`Admin`, `Manager`, `Staff`).
3. **Audit Trail via Separate Table:**
   Registration history (cancellations/registrations) is tracked in a dedicated `registration_histories` table rather than soft deletes or simple status columns. This provides a clear, append-only audit log detailing *who* did *what* and *when*.

## Preventing Over-registration (Concurrency)
The core requirement is that a workshop can *never* exceed its capacity, even during chaotic Saturday mornings with concurrent requests.
**Solution: Database Pessimistic Locking.**
In `RegisterAttendeeAction`, the registration logic is wrapped in a database transaction (`DB::transaction`). Before registering, we retrieve the workshop using `->lockForUpdate()`. This tells the database (e.g., MySQL/PostgreSQL) to lock the workshop row. Any concurrent request attempting to register for the same workshop will be forced to wait until the first transaction completes. Once the lock is acquired, we perform a strict count of `active` registrations and reject the request if it exceeds capacity. This ensures absolute data integrity at the database level.

## Assumptions Made
1. **Internal Application:** Since there is no public signup, it's assumed all users (Staff, Managers) are created by Admins manually (using Tinker or a user management UI, though omitted due to time).
2. **Email Uniqueness per Workshop:** Currently, the system allows the same email to be registered multiple times for the same workshop. If it should be unique, a unique constraint on `(workshop_id, email, status)` should be added.

## Trade-offs and What Was Skipped
- **Skipped Waitlist Feature:** The bonus waitlist feature was skipped to prioritize the core requirements (strict capacity rules, audit trail, roles, and a fully functioning end-to-end flow).
- **Skipped Admin User Management UI:** Given the time constraint, a dedicated UI for Admins to create Staff/Manager accounts was omitted. Seeders provide initial accounts.
- **Form Component Polish:** While functional, the form UI relies on native HTML5 validation paired with basic Laravel error bags rather than complex client-side validation libraries (like Zod + React Hook Form), prioritizing speed of delivery.
- **Automated Testing:** Dedicated Pest tests for the concurrency locking were omitted, though in a real scenario, concurrent testing would be vital.
