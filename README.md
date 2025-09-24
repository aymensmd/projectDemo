<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
=======
# projectDemo
>>>>>>> origin/add-project-demo
````markdown
# HRM + Workflow Builder Backend Design (Laravel + MySQL)

This document outlines a complete, production-ready backend design for your HRM + Workflow Builder application using Laravel + MySQL. It covers architecture, data model, API surface, background processing, security, CI/CD, deployment, and an implementation checklist.

## What's Covered

*   High-level architecture and responsibilities
*   Database model (tables + relationships) and ER description
*   API design (routes, methods, sample payloads) for main features
*   Workflow engine design (nodes, edges, execution, logs)
*   Background jobs, queues, scheduling, notifications
*   Auth & authorization, packages to use
*   Storage, files, and integrations
*   Tests, QA, CI/CD and deployment recommendations
*   Security, performance, monitoring, and backups
*   Minimal setup & useful commands

## High-Level Architecture

*   **Backend:** Laravel (latest LTS), RESTful JSON API (versioned, e.g., `/api/v1`).
*   **DB:** MySQL (primary). Use InnoDB for transactions and FK constraints.
*   **Auth:** Laravel Sanctum for SPA tokens or Laravel Passport if OAuth required.
*   **Queues:** Redis (recommended) + Laravel Queue + Horizon for monitoring.
*   **Realtime:** Laravel Echo + Pusher or Socket server (Redis + Socket.IO) for broadcasts.
*   **Storage:** S3-compatible for files; local for dev.
*   **Background processing:** Workers for workflow execution, notifications, exports.
*   **Dev tooling:** Factories, Seeders, PHPUnit, Pest (optional), Laravel Telescope (debug), Laravel-IDE helper.

## Key Packages (Composer)

*   `laravel/sanctum` or `laravel/passport`
*   `spatie/laravel-permission` (roles & permissions)
*   `laravel/horizon` (queue UI)
*   `predis/predis` or `phpredis` (redis client)
*   `spatie/laravel-activitylog` (audit logs)
*   `maatwebsite/excel` (reports export)
*   `laravel/telescope` (debug in staging)
*   `fruitcake/laravel-cors` (if necessary)
*   `guzzlehttp/guzzle` (HTTP node integration)

## Database Schema (Core Tables)

Below are primary tables. Keep migrations small and normalized.

*   **users**
    *   `id`, `name`, `email` (unique), `password`, `avatar_url`, `phone`, `status`, `last_login_at`, `created_at`, `updated_at`
*   **roles** (via spatie) & **model\_has\_roles** (pivot)
*   **permissions** & **model\_has\_permissions** (spatie)
*   **employees** (optional separate profile)
    *   `id`, `user_id`, `employee_code`, `job_title`, `department_id`, `manager_id`, `hire_date`, `salary`, `meta` (json), `created_at`, `updated_at`
*   **departments**
    *   `id`, `name`, `manager_id`, `created_at`, `updated_at`
*   **projects**
    *   `id`, `name`, `description`, `status`, `progress` (int), `start_date`, `end_date`, `owner_id`, `created_at`, `updated_at`
*   **project\_members** (pivot)
    *   `id`, `project_id`, `user_id`, `role`, `joined_at`
*   **tasks**
    *   `id`, `project_id`, `title`, `description`, `assignee_id`, `status`, `due_date`, `priority`, `created_at`, `updated_at`
*   **timesheets**
    *   `id`, `user_id`, `task_id`, `date`, `hours`, `notes`
*   **vacations / leaves**
    *   `id`, `user_id`, `start_date`, `end_date`, `type`, `status`, `approver_id`, `reason`
*   **notifications**
    *   `id`, `user_id`, `type`, `payload` (json), `read_at`, `created_at`
*   **workflows**
    *   `id`, `name`, `slug`, `owner_id`, `description`, `settings` (json), `created_at`, `updated_at`
*   **workflow\_nodes**
    *   `id`, `workflow_id`, `node_key`, `type`, `position_x`, `position_y`, `config` (json), `created_at`, `updated_at`
*   **workflow\_edges**
    *   `id`, `workflow_id`, `source_node_id`, `target_node_id`, `condition` (json)
*   **workflow\_executions**
    *   `id`, `workflow_id`, `status`, `started_at`, `finished_at`, `input` (json), `output` (json), `metadata` (json)
*   **workflow\_node\_executions**
    *   `id`, `execution_id`, `node_id`, `status`, `started_at`, `finished_at`, `result` (json), `logs` (text)
*   **files** (or attachments)
    *   `id`, `user_id`, `path`, `disk`, `mime`, `size`, `type`, `related_id`, `related_type`, `created_at`
*   **audit\_logs** (spatie or custom)
    *   `id`, `user_id`, `model_type`, `model_id`, `action`, `changes` (json), `created_at`
*   **surveys, rewards, reports, etc.** (separate tables)

### Relationships:

*   `user` hasMany `projects` (owner), `tasks` (assignee), `notifications`, `timesheets`
*   `project` hasMany `tasks`, `members`
*   `workflow` hasMany `nodes`, `edges`, `executions`
*   `workflow_execution` hasMany `workflow_node_executions`

**ER note:** `workflow_nodes` and `workflow_edges` form a directed graph. `workflow_executions` reference the version of the workflow graph used.

## Workflow Engine Design (Conceptual)

Goal: reliable, auditable, and extensible execution for node-based workflows.

*   **Workflow definition:**
    *   Stored in DB (`workflows`, `nodes`, `edges`). Node configs hold type + settings (HTTP URL, method, headers; email template; delay ms; conditional logic).
*   **Trigger types:**
    *   Manual, scheduled (cron), webhook, event (user created, leave request), or API trigger.
*   **Execution flow:**
    1.  Trigger creates `workflow_executions` row (status: running).
    2.  A coordinator job reads start node(s) and dispatches node jobs to queue.
    3.  Each node job executes its type logic and writes `workflow_node_executions` (status, result).
    4.  On success, job dispatches downstream node jobs per edges (supports conditions).
    5.  Failures recorded, retries controlled via queue retry/backoff rules.
*   **Node types (initial set):**
    *   HTTP Request (Guzzle), Email (Mailable + queue), Delay/Timer, Branch/Condition, DB Action, Trigger Webhook, Custom PHP Plugin.
*   **Execution guarantees:**
    *   Use idempotency keys where needed.
    *   Persist node status for recovery/inspection.
*   **Observability:**
    *   `workflow_executions` + `node_executions` provide full audit.
    *   Horizon + logs for visibility.

## API Design (Versioned)

Base: `/api/v1`

### Auth

*   `POST /api/v1/auth/login` -> `{ email, password } => token`
*   `POST /api/v1/auth/logout`
*   `POST /api/v1/auth/refresh` (if using Passport)
*   `GET /api/v1/auth/me`

### Users & Roles

*   `GET /api/v1/users`
*   `GET /api/v1/users/{id}`
*   `POST /api/v1/users` (create)
*   `PUT /api/v1/users/{id}`
*   `DELETE /api/v1/users/{id}`
*   `POST /api/v1/users/{id}/roles` -> assign roles

### Projects

*   `GET /api/v1/projects`
*   `GET /api/v1/projects/{id}`
*   `POST /api/v1/projects`
*   `PUT /api/v1/projects/{id}`
*   `DELETE /api/v1/projects/{id}`
*   `POST /api/v1/projects/{id}/members` -> `{ user_id, role }`

### Tasks

*   `GET /api/v1/projects/{projectId}/tasks`
*   `POST /api/v1/projects/{projectId}/tasks`
*   `PATCH /api/v1/tasks/{id}/status` -> `{ status }`

### Workflow Builder & Execution

*   `GET /api/v1/workflows`
*   `GET /api/v1/workflows/{id}`
*   `POST /api/v1/workflows` (create)
*   `PUT /api/v1/workflows/{id}` (update nodes/edges JSON)
*   `DELETE /api/v1/workflows/{id}`
*   `POST /api/v1/workflows/{id}/trigger` -> `{ input }` (manual run)
*   `GET /api/v1/workflows/{id}/executions`
*   `GET /api/v1/executions/{executionId}`
*   `POST /api/v1/workflows/{id}/export` -> returns JSON file
*   `POST /api/v1/workflows/import` (multipart/json upload)
*   `GET /api/v1/workflows/{id}/logs`

### Calendar / Leaves

*   `GET /api/v1/leaves`
*   `POST /api/v1/leaves`
*   `PATCH /api/v1/leaves/{id}/approve`
*   `PATCH /api/v1/leaves/{id}/reject`

### Notifications

*   `GET /api/v1/notifications`
*   `POST /api/v1/notifications/send` -> `{ user_id, type, payload }`

### Reports

*   `GET /api/v1/reports/summary`
*   `POST /api/v1/reports/export` -> returns CSV/Excel

### Search & Metadata

*   `GET /api/v1/search?q=`
*   `GET /api/v1/meta/roles, departments, statuses`

### Sample Request/Response (Trigger Workflow)
