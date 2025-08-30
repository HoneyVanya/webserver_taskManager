# Production-Grade Task Manager API

This repository contains the source code for a robust, production-grade RESTful API for a Task Manager application. Built with **Node.js**, **Express**, and **TypeScript**, it leverages **Prisma** for ORM, is backed by a containerized **PostgreSQL** database, and features a professional, decoupled architecture powered by **InversifyJS** for Dependency Injection.

The project's primary purpose is to serve as a blueprint for modern backend development, showcasing a deliberate architectural evolution from a simple prototype to a highly scalable, maintainable, and testable system.

---

## Architectural Evolution: A Three-Phase Journey

This application was not built in its final state. It underwent two significant and intentional refactoring phases to embody professional software engineering principles.

### Phase 1: The Initial Prototype

The project began with a functional but simplistic structure where business logic, data access, and HTTP handling were tightly coupled within controller functions. While functional, this design lacked reusability and was difficult to test.

### Phase 2: The Layered Architecture Refactor

The first major refactor introduced a professional layered architecture, embracing the **Separation of Concerns**.

-   **Service Layer (`/services`):** All business logic and database interactions were moved into a dedicated service layer.
-   **Middleware-First Approach (`/middleware`):** Cross-cutting concerns like authentication (`protect`), input validation (`validate`), and error handling (`errorHandler`) were centralized into a clean, reusable middleware pipeline.
-   **Declarative Validation (`/schemas`):** Zod schemas were introduced to define the shape of incoming data, providing powerful runtime validation and type safety.

This phase produced a clean, scalable, and maintainable codebase.

### Phase 3: The Dependency Injection Refactor (Inversion of Control)

The final architectural evolution addressed the last SOLID principle: **Dependency Inversion**. The goal was to fully decouple the application's layers to maximize testability and flexibility.

-   **The Problem:** Controllers were still directly `import`ing and depending on concrete service implementations, creating a rigid structure (`Controller -> Service -> Database`). This made it difficult to test components in isolation.

-   **The Solution (`InversifyJS`):** We introduced a lightweight **Inversion of Control (IoC) container**.
    -   **Services and Controllers** were refactored into classes decorated with `@injectable()` and `@controller()`.
    -   **Dependencies are now "injected"** via the constructor. Controllers no longer depend on a *concrete* `TaskService`; they depend on an `ITaskService` *abstraction* (an interface).
    -   A central **container (`inversify.config.ts`)** is now responsible for creating instances and wiring the dependencies together.

This final phase transformed the application into a highly professional, decoupled system that is significantly easier to unit test and maintain.

---

## Core Features & Technology

| Category         | Technology / Feature                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------- |
| **Core**         | Node.js, Express.js, TypeScript                                                             |
| **Architecture** | **InversifyJS** (Dependency Injection), SOLID Principles, Layered Design                    |
| **Database**     | PostgreSQL (via Docker), **Prisma** (ORM), Transactions, Indexing                           |
| **Authentication** | JWT (**Access & Refresh Tokens**), **Passport.js** (OAuth 2.0 with Google), Password Hashing |
| **Security**     | Rate Limiting (Brute-Force Protection), **Google ReCaptcha** (Bot Protection), CORS          |
| **Logging**      | **Pino** for structured, production-grade logging                                           |
| **Validation**   | **Zod** for schema-based, type-safe validation                                              |
| **Dev Experience** | `tsx` for live-reloading, Docker Compose for easy setup                                     |
| **API Docs**     | **Swagger/OpenAPI** via a clean `swagger.yaml` definition                                   |

---

## Getting Started

*(This section can remain largely the same, but ensure your `.env.example` file is up-to-date with all the new variables like `GOOGLE_CLIENT_ID`, `JWT_REFRESH_SECRET`, etc.)*

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or newer)
-   [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/HoneyVanya/webserver_taskManager.git
    cd webserver_taskManager
    ```

2.  **Create your environment file:**
    ```bash
    cp .env.example .env
    ```
    _Fill in all the required variables in the `.env` file, including your database URL and all authentication secrets._

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Start the database container:**
    ```bash
    docker-compose up -d
    ```

5.  **Apply database migrations:**
    ```bash
    npx prisma migrate dev
    ```

6.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The API is now running at `http://localhost:3000`. The interactive API documentation is available at `http://localhost:3000/docs`.