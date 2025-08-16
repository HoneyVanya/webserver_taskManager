import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/task.routes.js';
import userRoutes from './routes/user.routes.js';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import swaggerJSDoc from 'swagger-jsdoc';
import SwaggerUi from 'swagger-ui-express';

const app = express();

const allowedOrigins = ['http://localhost:3000'];

const corsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
    ) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.use(errorHandler);

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Manager API',
            version: '1.0.0',
            description:
                'A REST API for a simple Task Manager application, documented with Swagger',
            contact: {
                name: 'HoneyVanya',
            },
        },
        servers: [
            {
                url: `http://localhost:${env.PORT}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: [
        './src/routes/auth.routes.ts',
        './src/routes/task.routes.ts',
        './src/routes/user.routes.ts',
    ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/docs', SwaggerUi.serve, SwaggerUi.setup(swaggerSpec));

app.listen(env.PORT, () => {
    console.log(`Server is running on http://localhost:${env.PORT}`);
});
