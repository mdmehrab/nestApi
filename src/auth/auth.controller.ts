import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Response,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { Response as Res } from 'express';
import { Role } from './decorator/role.decorator';
import { Roles } from './schema/user.schema';
import { AuthGuard } from './middleware/auth.guard';

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
        httpOnly: false, // Cannot be accessed via JavaScript
        secure: true, // Only send the cookie over HTTPS in production
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
      });

      return res.json({
        message: 'Login successful',
      });
    } catch (err) {
      console.log(err);
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }

  // IF ADMIN APPROVED
  @Patch('/approve/:id')
  @Role(Roles.ADMIN)
  async approveUser(@Param('id') userId: string) {
    const user = await this.authService.approveUser(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'User approved successfully' };
  }

  // =========================== forget password ===========================
  // =========================== Forgot Password ===========================
  @UseGuards(AuthGuard) // Optional: Use this if you want only authenticated users to access the forgot-password route
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    try {
      await this.authService.sendForgotPasswordEmail(email);
      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // ================= Reset Password =================
  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    try {
      await this.authService.resetPassword(token, newPassword);
      return { message: 'Password has been reset successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
