import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "src/common/types";
import { ROLES_KEY } from "../../common/decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const requestUser = request.user;

    if (requestUser.isSuperAdmin == 1) return true;
    const permissions = Array.isArray(requestUser.permissions)
      ? requestUser.permissions
      : [];

    return requiredRoles.some((role) =>
      permissions.includes(`${role.module}_${role.permission}`)
    );
  }
}
