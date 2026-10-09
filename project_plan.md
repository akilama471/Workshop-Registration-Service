# Workshop Registration Service - Project Plan

Based on the technical guidelines and assignment requirements, here is a structured, multi-phase plan to build the Workshop Registration Service.

## Technology Stack
- **Backend**: Laravel (PHP)
- **Frontend**: React.js via Inertia.js
- **UI Components**: Shadcn UI & Tailwind CSS (configured with strict color palette)
- **Access Control**: Spatie Laravel Permission
- **Database**: MySQL or PostgreSQL

---

## Phase 1: Project Setup & Foundation
**Goal**: Initialize the project, set up the frontend architecture, and configure the UI system.
1. **Initialize Laravel**: Create a new Laravel project.
2. **Frontend Setup**: Install Inertia.js, React, and Tailwind CSS.
3. **UI/UX Configuration**: 
   - Configure Tailwind to use the strict color palette defined in the guidelines (`#303f9f`, `#c5cae9`, `#3f51b5`, etc.). Disable gradients.
   - Install and configure Shadcn UI.
   - Set up reusable base components (Buttons, Inputs, Tables, Modals).
4. **Environment**: Configure the `.env` file and database connection.

---

## Phase 2: Database Design & Access Control
**Goal**: Design the data layer, set up roles/permissions, and prepare seeders.
1. **Dependencies**: Install `spatie/laravel-permission`.
2. **Database Schema & Migrations**:
   - `users`: Default Laravel table.
   - `workshops`: `id`, `code` (unique), `title`, `instructor`, `starts_at`, `capacity`, `status`, timestamps.
   - `registrations`: `id`, `workshop_id`, `name`, `email`, `status` (active/cancelled), `created_by`, timestamps.
   - `registration_history`: `id`, `registration_id`, `action` (registered/cancelled), `user_id`, timestamps (Audit trail).
3. **Models & Relationships**: Implement Eloquent models with strict `$fillable` properties to prevent mass-assignment.
4. **Seeders (Crucial)**: 
   - Create roles (`Admin`, `Manager`, `Staff`) and assign permissions.
   - Seed an initial `Admin` user (credentials documented in README).
   - Seed sample workshops for testing.

---

## Phase 3: Core Backend Implementation
**Goal**: Build the core business logic, ensuring strict concurrency control and thin controllers.
1. **Authentication**: Set up internal login (no public registration).
2. **Business Logic (Action Classes)**:
   - `RegisterAttendeeAction`: **Critical** - Implement database pessimistic locking (`$workshop->lockForUpdate()`) within a DB transaction to strictly prevent overbooking.
   - `CancelRegistrationAction`: Update registration status and log the action.
   - `CreateWorkshopAction` & `UpdateWorkshopAction`.
3. **Controllers & Routing**: Create Thin Controllers that only handle HTTP requests and delegate logic to Action classes.
4. **Validation & Security**: 
   - Create Laravel Form Requests for all incoming data.
   - Apply strict Role-Based Route Middleware and Model Policies to enforce access control (e.g., Staff cannot add workshops).

---

## Phase 4: Frontend Development (React/Inertia)
**Goal**: Build the user interface using modular components and React hooks.
1. **Layout & Navigation**: Create a master layout with role-based navigation menus.
2. **Workshop Catalogue (Dashboard)**:
   - Display a list/grid of workshops.
   - Implement filters: Date Range, Status, and Available Seats.
3. **Workshop Management (Manager only)**:
   - Forms and Modals to Add and Edit workshops.
4. **Registration Flow (Manager & Staff)**:
   - A modal to register attendees (requires Name and Email only).
   - Graceful error handling for concurrency issues (e.g., "Seat just taken").
5. **Registration History View**: 
   - A page/modal to view the full audit trail of registrations and cancellations for a specific workshop.

---

## Phase 5: Optimization & Background Tasks
**Goal**: Improve performance and automate system tasks.
1. **Caching**: Cache workshop catalogue queries and role configurations to reduce DB load.
2. **Scheduled Tasks (Cron)**: Create a Laravel scheduled command to automatically update workshop statuses to 'Completed' when their scheduled time passes.
3. **Queues (Optional/Bonus)**: Offload audit logging or notification dispatching to background jobs.
4. **Rate Limiting**: Apply rate limits to login and registration endpoints.

---

## Phase 6: Documentation & Polish
**Goal**: Finalize deliverables as per the assignment requirements.
1. **Testing & QA**: End-to-end testing of the registration concurrency rule.
2. **Setup Instructions**: Write a clear `README.md` with local setup steps and seeded Admin credentials.
3. **Architecture Document**: Write the required 1-page document detailing:
   - Stack choices and justifications.
   - Design decisions (Action classes, thin controllers).
   - Explanation of how over-registration is prevented (Pessimistic locking).
   - Any trade-offs or assumptions made.
