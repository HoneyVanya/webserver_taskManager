# Task Manager API

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Node.JS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-%232D3748.svg?style=for-the-badge&logo=Prisma&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![GitLab CI](https://img.shields.io/badge/gitlab%20ci-%23181717.svg?style=for-the-badge&logo=gitlab&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

This repository contains the backend service for a full-stack Task Manager application. It was architected from the ground up to be a production-ready, resilient, and fully automated system, demonstrating modern software engineering principles from architecture to deployment.

**[View the Live Demo](https://tasks.webservertaskmanager.com)**
**[View the Live API Documentation](https://taskmanager-group.gitlab.io/webserver_taskmanager/)**

The official client for this API is the [**Task Manager Frontend Repository**](https://gitlab.com/taskmanager-group/taskmanager_frontend).

---

## ✨ Core Features & Technical Pillars

This project is a showcase of a robust, modern backend system.

| Category         | Technology / Feature                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------- |
| **Architecture** | **SOLID** & **GRASP** Principles, **InversifyJS** (IoC), **CQRS**                             |
| **Database**     | PostgreSQL, **Prisma ORM** (with migrations and a dedicated test database)                  |
| **API**          | Express.js, RESTful principles, **Swagger/OpenAPI** documentation                           |
| **Authentication** | JWT (**Access & Refresh Tokens**), **Passport.js** (Google OAuth 2.0)                     |
| **Security**     | Rate Limiting, **Google ReCaptcha**, Password Hashing (bcrypt), Automated Vulnerability Scanning (`npm audit`) |
| **Logging**      | **Pino** for structured JSON logging, streamed directly to **AWS CloudWatch** for monitoring. |
| **Testing**      | **Jest** & **Supertest** for automated integration tests in a fully containerized environment     |
| **DevOps**       | **Docker**, Multi-stage Dockerfiles, **NGINX**, **GitLab CI/CD**, **AWS EC2**, **Let's Encrypt (TLS)**, **GitLab Pages** |

---

## 🏛️ A Foundation of Professional Design Principles

This project was built with a deep focus on creating a clean, maintainable, and scalable architecture. The design is guided by the fundamental **SOLID** and **GRASP** principles.

-   **SOLID Principles:** Every class is designed for resilience.
    -   **Single Responsibility:** The **CQRS** pattern (`TaskCommands`, `TaskQueries`) ensures each class has one, and only one, reason to change.
    -   **Dependency Inversion:** **InversifyJS** is used to "invert control," ensuring high-level modules (Controllers) depend on abstractions (interfaces), not on low-level details (Services).
    -   **Open/Closed:** The use of services and interfaces allows for new features to be added without modifying existing, working code.
    -   **Liskov Substitution:** Interfaces (`IUserCommands`) are used to ensure that implementations can be swapped (e.g., for testing) without breaking the application.
    -   **Interface Segregation:** Small, specific interfaces (`ITaskCommands`, `ITaskQueries`) prevent classes from depending on methods they don't use.


-   **GRASP Principles:** Responsibilities are assigned intelligently across the system.
    -   **Information Expert:** Logic resides in the class with the most information to perform it (e.g., `AuthService` handles all authentication logic).
    -   **Low Coupling & High Cohesion:** The combination of **InversifyJS** (for low coupling) and **CQRS** (for high cohesion) results in a system where components are independent and focused.
    -   **Controller:** Express controllers act as thin, clean entry points that delegate all business logic to the expert services.

---

## 🚀 The Automated DevSecOps Lifecycle

This project is configured with a professional, multi-stage GitLab CI/CD pipeline that ensures quality, security, and automates deployment. On every push to the `main` branch, the pipeline automatically:

1.  **🧪 Test:** Spins up a dedicated Docker Compose environment with a fresh PostgreSQL database. It runs a security scan (`npm audit`) for known vulnerabilities and then executes the full suite of **Jest/Supertest** integration tests. If any test or scan fails, the pipeline stops immediately.
2.  **📦 Build:**
    -   Builds a lean, multi-stage production **Docker image** for the backend application.
    -   Pushes the tagged image to the **GitLab Container Registry**.
    -   Builds the React frontend by cloning its repository using a secure `CI_JOB_TOKEN`.
    -   Bundles all necessary deployment files (`docker-compose.prod.yml`, NGINX config, frontend assets) as artifacts.
3.  **☁️ Deploy:**
    -   Securely connects to an **AWS EC2** instance via SSH.
    -   Cleans the deployment directory and copies the new artifacts.
    -   Pulls the new backend image from the GitLab Registry and gracefully restarts all services using **Docker Compose**.
    -   All container logs are automatically streamed to **AWS CloudWatch** for centralized, production-grade monitoring.
4.  **📄 Pages:**
    -   In a parallel job, the pipeline uses **Redocly** to build a professional, static HTML documentation site from the `swagger.yaml` file.
    -   This site is then automatically deployed and hosted using **GitLab Pages**.

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