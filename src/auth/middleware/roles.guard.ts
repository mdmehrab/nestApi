import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../decorator/role.decorator';
import { Roles, User } from '../schema/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new HttpException('Token missing', HttpStatus.UNAUTHORIZED);
    }

    let decoded: any;
    try {
      decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      request.user = decoded;  // Attach the decoded user to the request
    } catch (err) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const requiredRoles = this.reflector.get<Roles[]>(ROLES_KEY, context.getHandler());

    if (!requiredRoles) {
      return true; // No roles specified, allow access
    }

    const user: User = request.user;
    if (!requiredRoles.includes(user.roles)) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return true;  // User has the required role
  }
}
