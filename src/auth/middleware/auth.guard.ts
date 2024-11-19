import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new HttpException('Token missing', HttpStatus.UNAUTHORIZED);
    }

    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the same secret as in your AuthService
      request.user = decoded; // Attach the decoded user to the request
      return true; // Allow access
    } catch (err) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
