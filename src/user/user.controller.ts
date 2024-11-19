import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';  
import { User } from '../auth/schema/user.schema';  
import { AuthGuard } from 'src/auth/middleware/auth.guard';

@Controller('users')  
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get all users
  @UseGuards(AuthGuard) 
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
