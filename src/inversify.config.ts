import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types/types.js';

import { ITaskService } from './services/interfaces/task.service.interface.js';
import { IUserService } from './services/interfaces/user.service.interface.js';
import { IAuthService } from './services/interfaces/auth.service.interface.js';

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
