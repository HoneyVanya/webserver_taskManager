# Task Manager API

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Node.JS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-%232D3748.svg?style=for-the-badge&logo=Prisma&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![GitLab CI](https://img.shields.io/badge/gitlab%20ci-%23181717.svg?style=for-the-badge&logo=gitlab&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

This repository contains the backend service for a full-stack Task Manager application. It was architected from the ground up to be a production-ready, resilient, and fully automated system, demonstrating modern software engineering principles from architecture to deployment.

**[View the Live Demo](https://tasks.webservertaskmanager.com)**

The official client for this API is the [**Task Manager Frontend Repository**](https://gitlab.com/taskmanager-group/taskmanager_frontend).

---

## ✨ Core Features & Technical Pillars

This project is a showcase of a robust, modern backend system.

| Category         | Technology / Feature                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------- |
| **Architecture** | **InversifyJS** (IoC), **CQRS** (Command Query Responsibility Segregation), **SOLID** Principles |
| **Database**     | PostgreSQL, **Prisma ORM** (with migrations and a dedicated test database)                  |
| **API**          | Express.js, RESTful principles, **Swagger/OpenAPI** documentation                           |
| **Authentication** | JWT (**Access & Refresh Tokens**), **Passport.js** (Google OAuth 2.0)                     |
| **Security**     | Rate Limiting, **Google ReCaptcha**, Password Hashing (bcrypt), CORS                        |
| **Logging**      | **Pino** for structured JSON logging, streamed directly to **AWS CloudWatch** for monitoring. |
| **Testing**      | **Jest** & **Supertest** for automated integration tests in a fully containerized environment     |
| **DevOps**       | **Docker**, Multi-stage Dockerfiles, **NGINX**, **GitLab CI/CD**, **AWS EC2**, **Let's Encrypt (TLS)** |

---

## 🏛️ The Architectural Journey: From Prototype to Production

A key goal of this project was to demonstrate an intentional architectural evolution, mirroring the process of building a mature, scalable application.

#### **Phase 1: The Monolithic Prototype**
The project began with a simple, functional design where business logic, data access, and HTTP handling were tightly coupled. While quick to build, this approach lacked scalability and testability.

#### **Phase 2: The Layered Architecture**
The first major refactor introduced a professional layered architecture, embracing the **Separation of Concerns** principle.
-   **Service Layer (`/services`):** All business logic was extracted into dedicated, reusable services.
-   **Middleware Pipeline (`/middleware`):** Cross-cutting concerns like authentication (`protect`) and input validation (`validate`) were moved into a clean middleware chain.
-   **Declarative Validation (`/schemas`):** **Zod** was introduced for powerful, type-safe runtime validation of API inputs.

#### **Phase 3: Decoupling with Inversion of Control (IoC) & CQRS**
The final refactor achieved a fully decoupled and highly testable system by implementing the **Dependency Inversion** principle.
-   **Inversion of Control (IoC):** Using **InversifyJS**, dependencies are no longer directly imported. Instead, they are "injected" via a central container, breaking hard dependencies between layers (`Controller <- IAuthService` instead of `Controller -> AuthService`).
-   **CQRS (Command Query Responsibility Segregation):** To further clarify intent, services were split into "Commands" (write operations like `createUser`) and "Queries" (read operations like `findAllUsers`). This results in smaller, highly cohesive classes that are easier to understand, test, and maintain.

---

## 🚀 The Automated DevOps Lifecycle

This project is configured with a professional, three-stage GitLab CI/CD pipeline that ensures quality and automates deployment. On every push to the `main` branch, the pipeline automatically:

1.  **🧪 Test:** Spins up a dedicated Docker Compose environment with a fresh PostgreSQL database. It runs the full suite of **Jest/Supertest** integration tests against the API. If any test fails, the pipeline stops immediately.
2.  **📦 Build:**
    -   Builds a lean, multi-stage production **Docker image** for the backend application.
    -   Pushes the tagged image to the **GitLab Container Registry**.
    -   Clones the frontend repository (using a `CI_JOB_TOKEN` for secure access) and runs its build process to generate static assets.
    -   Bundles all necessary deployment files (`docker-compose.prod.yml`, NGINX config, frontend assets) as artifacts.
3.  **☁️ Deploy:**
    -   Securely connects to an **AWS EC2** instance via SSH.
    -   Cleans the deployment directory and copies the new artifacts.
    -   Connects to the GitLab Registry, pulls the new backend image, and gracefully restarts all services using **Docker Compose**.
    -   All container logs are automatically streamed to **AWS CloudWatch** for centralized, production-grade monitoring.
    -   The deployment script finishes by running `docker system prune` on the server to maintain a clean environment.

---

## 🛠️ Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v22 or newer recommended)
-   [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose

### 1. Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone https://gitlab.com/taskmanager-group/webserver_taskmanager.git
    cd webserver_taskmanager
    ```
2.  **Environment Variables:**
    Copy `.env.example` to `.env` and fill in all required variables.
    ```bash
    cp .env.example .env
    ```
3.  **Install Dependencies:**
    ```bash
    npm install
    ```
4.  **Start the Database Container:**
    ```bash
    docker compose up -d db
    ```
5.  **Apply Migrations:**
    ```bash
    npx prisma migrate dev
    ```
6.  **Run the Development Server:**
    The server supports hot-reloading with `tsx`.
    ```bash
    npm run dev
    ```

### 2. Running the Test Suite

The tests run in a fully isolated, containerized environment.
1.  Ensure Docker Desktop is running.
2.  Execute the test command:
    ```bash
    docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
    ```

### Environment Variables

| Variable                 | Description                                                  | Example Value                                       |
| ------------------------ | ------------------------------------------------------------ | --------------------------------------------------- |
| `DATABASE_URL`           | The connection string for your PostgreSQL development database. | `postgresql://myuser:mypassword@localhost:5432/taskmanager` |
| `DATABASE_URL_TEST`      | The connection string for the isolated test database.        | `postgresql://myuser:mypassword@localhost:5432/taskmanager_test` |
| `PORT`                   | The port the server will run on.                             | `3000`                                              |
| `JWT_ACCESS_SECRET`      | A long, random secret for signing short-lived access tokens. | `your-super-random-jwt-access-secret`               |
| `JWT_REFRESH_SECRET`     | A different long, random secret for signing refresh tokens.  | `another-super-random-jwt-refresh-secret`           |
| `JWT_ACCESS_EXPIRATION`  | The lifespan of an access token.                             | `15m`                                               |
| `JWT_REFRESH_EXPIRATION` | The lifespan of a refresh token.                             | `7d`                                                |
| `GOOGLE_CLIENT_ID`       | Your OAuth 2.0 Client ID from the Google Cloud Console.      | `...apps.googleusercontent.com`                     |
| `GOOGLE_CLIENT_SECRET`   | Your OAuth 2.0 Client Secret from the Google Cloud Console.  | `GOCSPX-...`                                        |
| `RECAPTCHA_SECRET_KEY`   | Your v2 Secret Key from the Google ReCaptcha Admin Console.  | `...`                                               |
| `GOOGLE_CALLBACK_URL`    | The full, public callback URL for Google OAuth.              | `http://localhost:3000/auth/google/callback`        |
| `FRONTEND_URL`           | The URL of the frontend application.                         | `http://localhost:5173`                             |