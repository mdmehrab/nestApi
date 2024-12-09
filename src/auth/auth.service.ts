import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly authModel: Model<User>,
  ) {}

  private readonly jwtSecret = process.env.JWT_SECRET;
  private readonly jwtExpires = '1h';

  // Register user
  async create(registerUserDto: RegisterUserDto): Promise<User> {
    const { password, roles, ...userData } = registerUserDto;
    const role = roles || 'USER';
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = new this.authModel({
      ...userData,
      password: hashedPassword,
      roles: role,
      isApproved: false,
    });

    return createdUser.save();
  }

  // Login user and generate JWT
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    const user = await this.authModel.findOne({ email }).exec();
    if (!user || !user.isApproved) {
      // Check if the user is approved
      throw new HttpException(
        'User not approved or invalid credentials',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = { id: user._id, roles: user.roles, email: user.email };
    const token = jwt.sign(payload, this.jwtSecret, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    return { accessToken: token };
  }

  // IF ADMIN APPROVED

  async approveUser(userId: string): Promise<User> {
    const user = await this.authModel.findById(userId).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.isApproved = true; // Approve the user
    return user.save();
  }

  // =========================== forget password ===========================
  async sendForgotPasswordEmail(email: string): Promise<void> {
    // Find the user by email
    const user = await this.authModel.findOne({ email }).exec();

    if (!user) {
      throw new HttpException(
        'User with that email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    // Generate a JWT token with the user's email and a short expiration time
    const token = jwt.sign({ email }, this.jwtSecret, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    // Create a transporter for sending email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_APP_PASS, // App password
      },
    });

    // Email details
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h3>Reset Your Password</h3>
        <p>Click the link below to reset your password. This link is valid for 1 hour:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  }
}
