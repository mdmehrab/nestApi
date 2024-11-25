import { Controller, Post, Body, HttpException, HttpStatus, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { Response as Res } from 'express';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async createUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.create(registerUserDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Response() res: Res) {
    try {
      const { accessToken } = await this.authService.login(loginDto);

      // Set the cookie with a 3-day expiration time
      res.cookie('access_token', accessToken, {
        httpOnly: true, // Cannot be accessed via JavaScript
        secure: process.env.NODE_ENV === 'production', // Only send the cookie over HTTPS in production
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
      });

      return res.json({
        message: 'Login successful',
      });
    } catch (err) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }
}
