import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorator/roles.decorator';
import { UserRole } from '../enum/user-role';
type RequestUser = {
  role?: UserRole;
};

type RequestWithUser = {
  user?: RequestUser;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>(Roles, context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user) throw new UnauthorizedException();

    return this.matchRoles(roles, user);
  }

  private matchRoles(requiredRoles: UserRole[], user: RequestUser): boolean {
    const userRole = user.role ?? UserRole.USER;
    return requiredRoles.includes(userRole);
  }
}