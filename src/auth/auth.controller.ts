import { Controller, Post, Body, HttpException, HttpStatus, Response, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { Response as Res } from 'express';
import { Role } from './decorator/role.decorator';
import { Roles } from './schema/user.schema';


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
}
