import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';  
import { User } from '../auth/schema/user.schema';  

@Controller('users')  
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get all users
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll(); 
  }

  // Get user profile
  @Get('/profile')
  async getProfile(@Request() req): Promise<User> {
    return this.userService.findUserByEmail(req.user.email); 
  }
}
