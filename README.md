# Production-Grade Task Manager API

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Node.JS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-%232D3748.svg?style=for-the-badge&logo=Prisma&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

This repository contains the backend service for a complete full-stack Task Manager application. It has been architected and deployed following modern, professional, production-grade standards.

**[View the Live Demo](https://tasks.webservertaskmanager.com)**

The official client for this API is the [**Task Manager Frontend Repository**](https://gitlab.com/HoneyVanya/taskmanager_frontend).

---

## ✨ Features & Technology

This project serves as a blueprint for modern full-stack development, showcasing a deliberate architectural evolution and a robust feature set.

| Category         | Technology / Feature                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------- |
| **Core**         | Node.js, Express.js, TypeScript                                                             |
| **Architecture** | **InversifyJS** (IoC), **CQRS**, SOLID Principles, Layered Design                           |
| **Database**     | PostgreSQL, **Prisma** (ORM)                                                                |
| **Authentication** | JWT (**Access & Refresh Tokens**), **Passport.js** (Google OAuth 2.0)                     |
| **Security**     | Rate Limiting, **Google ReCaptcha**, Password Hashing, CORS                                 |
| **Logging**      | **Pino** for structured, production-grade JSON logging                                      |
| **API Docs**     | **Swagger/OpenAPI** via a clean `swagger.yaml` definition                                   |
| **DevOps**       | **Docker**, **Docker Compose**, **NGINX**, **GitLab CI/CD**, **AWS EC2**, **Let's Encrypt (TLS)** |

---

## 🏛️ Architectural Evolution: A Three-Phase Journey

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

-   **The Problem:** Controllers were still directly `import`ing and depending on concrete service implementations, creating a rigid structure (`Controller -> Service -> Database`).
-   **The Solution (`InversifyJS`):** We introduced a lightweight **Inversion of Control (IoC) container**. Services and controllers were refactored into classes (`@injectable`, `@controller`), and dependencies are now "injected" via the constructor. A central container (`inversify.config.ts`) is now responsible for wiring the application together.
-   **Further Refinement (`CQRS`):** To make the system's intent even clearer, the primary services were split based on the **Command Query Responsibility Segregation** principle. "Write" operations (Commands, e.g., `createTask`) and "Read" operations (Queries, e.g., `findAllTasks`) are now handled by separate, dedicated classes (`TaskCommands`, `TaskQueries`). This makes the system more explicit and easier to maintain and scale.

This phase transformed the application into a highly professional, decoupled system that is significantly easier to unit test and maintain.

### Phase 4: The DevOps & Cloud Deployment
The final phase focused on building a complete DevOps lifecycle to deploy the application to a production environment on **Amazon Web Services (AWS)**.
-   **Containerization:** The full stack (Node.js App, PostgreSQL DB, NGINX) was containerized using **Docker** and **Docker Compose**.
-   **Reverse Proxy:** **NGINX** was configured as a reverse proxy to serve the static React frontend and proxy API requests to the Node.js backend from a single domain.
-   **Live Deployment:** The entire stack was deployed to a live **AWS EC2** instance, with the network and firewall (Security Groups, NACLs) configured from scratch.
-   **HTTPS/TLS:** The production domain was secured with a free, auto-renewing TLS/SSL certificate from **Let's Encrypt** via Certbot.
-   **Continuous Deployment (CD):** A complete CI/CD pipeline was built in **GitLab CI/CD**, which automatically builds, tests, and deploys any changes pushed to the `main` branch directly to the AWS server.

---

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or newer)
-   [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose
-   A Git client

### Installation & Local Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/HoneyVanya/webserver_taskManager.git
    cd webserver_taskManager
    ```

2.  **Create your environment file:**
    ```bash
    cp .env.example .env
    ```
    _Fill in all the required variables in the `.env` file using the table below as a guide._

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
    The API will be available at `http://localhost:3000`. The interactive API documentation is available at `http://localhost:3000/docs`.

### Environment Variables

The following environment variables are required for the application to run.

| Variable                 | Description                                                  | Example Value                                       |
| ------------------------ | ------------------------------------------------------------ | --------------------------------------------------- |
| `DATABASE_URL`           | The connection string for your PostgreSQL database.          | `postgresql://youruser:yourpassword@localhost:5432/taskmanager` |
| `PORT`                   | The port the server will run on.                             | `3000`                                              |
| `JWT_ACCESS_SECRET`      | A long, random secret for signing short-lived access tokens. | `some-very-long-and-random-secret-string`           |
| `JWT_REFRESH_SECRET`     | A different long, random secret for signing refresh tokens.  | `another-super-secret-string-for-refresh-tokens`    |
| `JWT_ACCESS_EXPIRATION`  | The lifespan of an access token.                             | `15m`                                               |
| `JWT_REFRESH_EXPIRATION` | The lifespan of a refresh token.                             | `7d`                                                |
| `GOOGLE_CLIENT_ID`       | Your OAuth 2.0 Client ID from the Google Cloud Console.      | `12345...apps.googleusercontent.com`                |
| `GOOGLE_CLIENT_SECRET`   | Your OAuth 2.0 Client Secret from the Google Cloud Console.  | `GOCSPX-...`                                        |
| `RECAPTCHA_SECRET_KEY`   | Your v2 Secret Key from the Google ReCaptcha Admin Console.  | `6Lcm...`                                           |
