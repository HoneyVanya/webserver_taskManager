# Webserver Task Manager API

This repository contains the source code for a robust RESTful API for a Task Manager application. Built with **Node.js**, **Express**, and **TypeScript**, it leverages Prisma for ORM and is backed by a containerized **PostgreSQL** database.

The project's primary purpose is to serve as a blueprint for modern backend development, showcasing a deliberate architectural evolution from a simple prototype to a scalable, layered, and maintainable system.

## Architectural Evolution: A Journey of Refactoring

This application was not built in its final state. It underwent a significant and intentional refactoring process to embody professional software engineering principles.

## Phase 1: The Initial Prototype & Challenges

The project began with a functional but simplistic structure. While it worked, it suffered from several design flaws that would hinder future development.

### Challenge 1: Tightly Coupled Logic
Controllers were doing everything: validating input, interacting with the database, and handling HTTP responses. This pattern leads to code duplication and makes it impossible to test business logic in isolation.

- **Before:** A controller looked like this, mixing all concerns.

<details>
<summary><b>Before: A Controller</b></summary>

```ts
// A simplified "before" example of a controller
export const createTask = async (req: Request, res: Response) => {
    try {
        // 1. Manual Validation
        const { title, authorId } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Title is required.' });
        }

        // 2. Direct Database Interaction
        const newTask = await prisma.task.create({
            data: { title, authorId }
        });

        // 3. Response Formatting
        res.status(201).json(newTask);
    } catch (error) {
        // 4. Generic, Repetitive Error Handling
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
``` 
</details>

### Challenge 2: Repetitive Authentication Logic
Every protected route had to repeat the same JWT decoding and user lookup logic, making the code noisy and violating the DRY (Don't Repeat Yourself) principle.

<details>
<summary><b>Before: Repetitive Auth Code</b></summary>

```ts
// Each protected controller started like this
let token = req.headers.authorization?.split(' ')[1];
if (!token) throw new Error('Not authorized');

const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await prisma.user.findUnique({ where: { id: decoded.id } });
if (!user) throw new Error('User not found');
// ... then the actual controller logic would begin
``` 
</details>

- **Coupled Logic:** Business logic (database queries via Prisma) was tightly coupled with the HTTP request/response handling directly within the controller functions.
- **Manual Processes:** Input validation was performed manually inside each controller, leading to code duplication and a higher risk of errors.
- **Scattered Concerns:** Responsibilities like authentication decoding, error formatting, and configuration were scattered throughout the application code.

While this approach worked for a small feature set, its limitations quickly became apparent. It lacked reusability, it seemed to be difficult to test in isolation, and would not scale gracefully as new features were added.

## Phase 2: Refactor for Scalability & Maintainability

To address these limitations, the application was systematically refactored into a layered architecture, embracing the **Separation of Concerns.**

### 1. Decoupling with a Service Layer (/services)

The most critical change was introducing a dedicated service layer to be the home for all business logic. This decouples the application's core logic from the transport layer (HTTP/Express). Controllers no longer know *how* data is manipulated; they simply request an action from a service. The result is lean, focused controllers and reusable, unit-testable business logic.

<details>
<summary><b>After: Lean Controller and Focused Service</b></summary>

```ts
// In: controllers/task.controller.ts
export const createTask = asyncHandler(async (req: Request, res: Response) => {
    // Delegate business logic to the service
    const newTask = await taskService.createTask(req.body.title, req.user!.id);
    res.status(201).json(newTask);
});

// In: services/task.service.ts
export const createTask = async (title: string, authorId: string) => {
    // Service owns the business logic and database interaction
    return prisma.task.create({ data: { title, authorId } });
};
```
</details>

- **Result:** Business logic is now reusable and can be unit-tested in complete isolation from Express.

- **What it is:** The new home for all business logic.
- **Why it matters:** It **decouples** the application's core logic from the transport layer (HTTP/Express). Controllers no longer know _how_ data is created or fetched; they simply request an action from a service. This makes services reusable across different controllers (or even different entry points, like a future WebSocket or gRPC service) and vastly simplifies unit testing.

### 2. Centralizing Logic with a Middleware-First Approach (/middleware)

Cross-cutting concerns were extracted from controllers and centralized into a clean, reusable middleware pipeline.

- **Automated Error Handling:** Verbose try...catch blocks were eliminated from controllers. We now use express-async-handler to automatically catch async errors and forward them to a single, authoritative errorHandler.ts. This central handler is responsible for inspecting all errors (including Prisma and Zod errors) and formatting a consistent, clean JSON response.
- **Centralized Authentication:** A single protect middleware now encapsulates all JWT verification logic. Securing an entire group of routes is as simple as one line: router.use(protect);.
- **Declarative Validation:** Manual if statements for validation were replaced by a generic validate.ts middleware. This "gatekeeper" takes a Zod schema from the /schemas directory, ensures no invalid data ever reaches the controller, and provides powerful, self-documenting validation logic.

### 3. Centralized & Validated Configuration (/config)

Application configuration was consolidated and hardened. In env.ts, all environment variables are now loaded and validated against a Zod schema at startup. The application will fail fast with a clear error message if the configuration is invalid, preventing mysterious runtime errors.

This deliberate, layered architecture is the cornerstone of a professional backend service, ensuring the application is prepared for future growth and complexity.

### 4. Centralized & Validated Configuration** (/config)

Application configuration was consolidated and hardened.

- **env.ts:** All environment variables are now loaded and validated against a Zod schema at startup. The application will fail fast with a clear error message if the configuration is invalid, preventing runtime errors caused by missing or malformed environment variables.

This deliberate, layered architecture is the cornerstone of a professional backend service. It ensures that the application is not only functional today but is also prepared for future growth and complexity.

### Technology Stack & Core Features

**Category**	    **Technology / Feature**
**Core**	        Node.js, Express.js, TypeScript
**Database**	    PostgreSQL (managed via Docker), Prisma (ORM)
**Authentication**	JSON Web Tokens (JWT), bcryptjs for password hashing
**Validation**	    Zod for schema-based, type-safe validation
**Architecture**	Layered (Routes, Controllers, Services, Middleware)
**Code Quality**	ESLint for linting, Prettier for code formatting
**Dev Experience**	tsx for live-reloading, docker-compose for easy setup

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or newer recommended)
- [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose

### Getting Started
### 1. Clone the Repository

`git clone https://github.com/HoneyVanya/webserver_taskManager.git`
`cd webserver_taskManager`

### 2. Install Dependencies

`npm install`

### 3. Configure Environment Variables

Create a .env file by copying the provided example.

`cp .env.example .env`

*Review the .env file and replace JWT_SECRET with a unique, long, and random string for security.*

### 4. Launch the Database

Start the PostgreSQL database container using Docker Compose.

`docker-compose up -d`

### 5. Apply Database Schema

Run the Prisma migration command to create the necessary tables in your database.

`npx prisma migrate dev`

### 6. Run the Development Server

Start the application. tsx will provide an excellent developer experience with hot-reloading.

`npm run dev`

The API is now running and accessible at http://localhost:3000.

### API Endpoint Documentation
### Authentication

Method	    Endpoint	    Description
POST	    /auth/login	    Authenticate a user and receive a JWT.

### Users

**Note:** For simplicity, these routes are currently unprotected. In a real production system, endpoints for updating or deleting other users should be restricted to admin roles.

**Method**	    **Endpoint**	    **Description**
POST	        /users	            Register a new user.
GET	            /users	            Get a list of all users.
PUT	            /users/:id	        Update a specific user.
DELETE	        /users/:id	        Delete a specific user.

### Tasks (Authentication Required)

*All endpoints below require a Bearer <token> in the Authorization header.*

**Method**	**Endpoint**	**Description**
GET	        /tasks	        Get all tasks for the logged-in user.
POST	    /tasks	        Create a new task for the user.
PUT	        /tasks/:id	    Update a specific task owned by the user.
DELETE	    /tasks/:id	    Delete a specific task owned by the user.

### Available Scripts

- npm run dev: Start the dev server with hot-reloading.
- npm run build: Compile TypeScript to JavaScript for production.
- npm start: Run the compiled production-ready server.
- npm run lint: Analyze code for style and errors.
- npm run format: Automatically format all code with Prettier.
- npx prisma studio: Open a GUI to view and edit data in your database.