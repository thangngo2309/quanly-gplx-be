import { Reflector } from '@nestjs/core';
import { UserRole } from '../enum/user-role';

export const Roles = Reflector.createDecorator<UserRole[]>();
