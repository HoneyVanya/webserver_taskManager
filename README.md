# Task Manager API


[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Node.JS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/) [![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/) [![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![Prisma](https://img.shields.io/badge/Prisma-%232D3748.svg?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/) [![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/) [![GitLab CI](https://img.shields.io/badge/gitlab%20ci-%23181717.svg?style=for-the-badge&logo=gitlab&logoColor=white)](https://docs.gitlab.com/ee/ci/) [![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)

This repository contains the backend service for a full-stack Task Manager application, architected from the ground up as a production-ready, resilient, and fully automated system.

**[Live Demo](https://tasks.webservertaskmanager.com)** | **[Static API Docs](https://taskmanager-group.gitlab.io/webserver_taskmanager/)** | **[Interactive API Explorer](https://tasks.webservertaskmanager.com/docs)**

---
 
## ✨ Technical Highlights

This project showcases a robust, modern backend system built on professional design principles and a fully automated DevOps lifecycle.

| Skill Category         | Technology / Principle Demonstrated                                        |
| ---------------------- | -------------------------------------------------------------------------- |
| **Architecture** | SOLID, Dependency Injection (InversifyJS), CQRS (Command/Query Separation) |
| **API & Database** | RESTful API (Express.js), ORM (Prisma), PostgreSQL, Database Migrations    |
| **Authentication** | JWT (Access/Refresh Tokens), OAuth 2.0 (Passport.js), Password Hashing (bcrypt)|
| **Testing** | Integration Testing (Jest, Supertest), Isolated Test Database (Docker)     |
| **DevOps & Cloud** | **Full CI/CD Pipeline (GitLab CI)**, Containerization (**Docker**), NGINX, **AWS EC2** |
| **Production Readiness**| Structured Logging (Pino), Rate Limiting, TLS/SSL (Let's Encrypt), ReCaptcha |

---

## 🏛️ Architectural Deep Dive

The system's design is guided by fundamental **SOLID** and **GRASP** principles to create a clean, maintainable, and scalable architecture.

-   **Dependency Inversion & Low Coupling:** **InversifyJS** is used to "invert control," ensuring high-level modules (Controllers) depend on abstractions (interfaces like `ITaskCommands`), not on low-level concrete implementations. This makes the system modular and easy to test.
-   **Single Responsibility & High Cohesion:** The **CQRS** pattern is applied by separating logic into `Commands` (for writing/mutating data, e.g., `createTask`) and `Queries` (for reading data, e.g., `findAllTasksForUser`). This ensures each class has a single, focused purpose.
-   **Controller:** Express controllers, built with `inversify-express-utils`, act as thin, clean entry points that delegate all business logic to the expert services, keeping them free of application logic.

---

## 🚀 The Automated DevSecOps Lifecycle

This project is configured with a professional, multi-stage GitLab CI/CD pipeline that automates quality assurance, security scanning, and deployment. On every push to `main`, the pipeline automatically:

1.  **🧪 Test:** Spins up a dedicated Docker Compose environment with a fresh PostgreSQL database. It runs a security scan (`npm audit`) and executes the full suite of **Jest/Supertest** integration tests.
2.  **📦 Build:**
    -   Builds and pushes a lean, multi-stage production Docker image for the backend to the GitLab Container Registry.
    -   Clones the frontend repository, builds the static assets, and bakes them into a custom, hardened NGINX Docker image.
3.  **☁️ Deploy:**
    -   Securely connects to an **AWS EC2** instance via SSH.
    -   Pulls the new backend and NGINX images from the GitLab Registry and gracefully restarts all services using **Docker Compose**.
4.  **📄 Pages:**
    -   In a parallel job, **Redocly** builds a professional, static HTML documentation site from the `swagger.yaml` file and deploys it using **GitLab Pages**.

---

## 🛠️ Getting Started Locally

### Prerequisites
-   [Node.js](https://nodejs.org/en/) (v22+)
-   [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose

1.  **Clone the repository:**
    ```bash
    git clone [https://gitlab.com/taskmanager-group/webserver_taskmanager.git](https://gitlab.com/taskmanager-group/webserver_taskmanager.git)
    cd webserver_taskmanager
    ```
2.  **Environment Variables:**
    Copy `.env.example` to `.env` and fill in all required variables.
    ```bash
    cp .env.example .env
    ```
3.  **Install Dependencies:** `npm install`
4.  **Start the Database:** `docker-compose up -d db`
5.  **Apply Migrations:** `npx prisma migrate dev`
6.  **Run the Dev Server:** `npm run dev` (with hot-reloading)

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