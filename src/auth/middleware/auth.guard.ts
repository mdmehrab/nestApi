import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { Request } from 'express';

interface AuthRequest extends Request {
  user?: any;  // Define the 'user' property in the request
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();  // Type-cast the request

    // Extract the token from cookies (assuming it's called 'access_token')
    const token = request.cookies['access_token'];

    if (!token) {
      throw new HttpException('Token expires, plz login again!', HttpStatus.UNAUTHORIZED);
    }

    try {
      // Verify the JWT token with the secret from the environment
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the decoded user to the request object
      request.user = decoded;

      return true;  // Allow access if the token is valid
    } catch (err) {
      // If the token is invalid or expired, throw an unauthorized error
      throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
    }
  }
}
