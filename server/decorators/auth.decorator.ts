import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';

export const Auth = (roles: Role | Role[] = [Role.USER]) => {
  const rolesArray = Array.isArray(roles) ? roles : [roles];

  return applyDecorators(
    SetMetadata('roles', rolesArray),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
};
