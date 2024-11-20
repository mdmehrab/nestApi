import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../auth/schema/user.schema';
import { AuthGuard } from 'src/auth/middleware/auth.guard';
import { RolesGuard } from 'src/auth/middleware/roles.guard';
import { Role } from 'src/auth/decorator/role.decorator';
import { Roles as RoleEnum } from '../auth/schema/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get all users - Only accessible by admins
  @UseGuards(AuthGuard, RolesGuard)  // Apply both AuthGuard and RolesGuard
  @Role(RoleEnum.ADMIN)  // Only admin role has access
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll(); 
  }

  // Get user profile
  @UseGuards(AuthGuard)
  @Get('/profile')
  async getProfile(@Request() req): Promise<User> {
    return this.userService.findUserByEmail(req.user.email); 
  }
}
