import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles, User } from '../auth/schema/user.schema';
import { AuthGuard } from 'src/auth/middleware/auth.guard';
import { RolesGuard } from 'src/auth/middleware/roles.guard';
import { Role } from 'src/auth/decorator/role.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get all users - Only accessible by admins
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @Get('all-users')
  async getAllUsers(): Promise<User[]> {
    const users = await this.userService.findAll();
    return users.filter((user) => user.roles !== 'ADMIN');
  }

  // Get user profile
  @UseGuards(AuthGuard)
  @Get('/profile')
  async getProfile(@Request() req): Promise<User> {
    // req.user will be populated by the AuthGuard
    return this.userService.findUserByEmail(req.user.email);
  }
}
