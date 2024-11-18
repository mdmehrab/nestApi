import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';


@Controller('users')
export class AuthController {
  constructor(private readonly  authService: AuthService) {}


  // register user 
  @Post('/register')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.create(createUserDto);
  }


  // Login user
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ user: User }> {
    return this.authService.login(loginDto);
  }

}
