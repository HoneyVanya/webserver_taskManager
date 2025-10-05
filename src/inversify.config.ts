import 'reflect-metadata';

import './controllers/auth.controller.js';
import './controllers/task.controller.js';
import './controllers/user.controller.js';

import { Container } from 'inversify';
import { TYPES } from './types/types.js';

import { ITaskCommands } from './types/task.commands.interface.js';
import { ITaskQueries } from './types/task.queries.interface.js';

import { taskCommands } from './services/task.commands.js';
import { taskQueries } from './services/task.queries.js';

import { IUserCommands } from './types/user.commands.interface.js';
import { IUserQueries } from './types/user.queries.interface.js';

import { userCommands } from './services/user.commands.js';
import { userQueries } from './services/user.queries.js';

import { IAuthService } from './types/auth.types.js';
import { AuthService } from './services/auth.service.js';

const container = new Container();

container.bind<ITaskCommands>(TYPES.TaskCommands).to(taskCommands);
container.bind<ITaskQueries>(TYPES.TaskQueries).to(taskQueries);
container.bind<IUserCommands>(TYPES.UserCommands).to(userCommands);
container.bind<IUserQueries>(TYPES.UserQueries).to(userQueries);
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);

export { container };
