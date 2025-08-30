import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types/types.js';

import { ITaskService } from './types/task.types.js';
import { IUserService } from './types/user.types.js';
import { IAuthService } from './types/auth.types.js';

import { UserService } from './services/user.service.js';
import { TaskService } from './services/task.service.js';
import { AuthService } from './services/auth.service.js';

import './controllers/task.controller.js';
import './controllers/user.controller.js';
import './controllers/auth.controller.js';

const container = new Container();

container.bind<ITaskService>(TYPES.TaskService).to(TaskService);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);

export { container };
