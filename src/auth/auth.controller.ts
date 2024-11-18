import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import { AuthService } from './auth.service';


@Controller('users')
export class AuthController {
  constructor(private readonly  authService: AuthService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.create(createUserDto);
  }

  // get all users 
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.authService.findAll();
  }
}
  