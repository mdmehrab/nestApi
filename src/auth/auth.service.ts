import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly authModel: Model<User>,
  ) {}

  private readonly jwtSecret = process.env.JWT_SECRET;

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
    if (!user || !user.isApproved) {  // Check if the user is approved
      throw new HttpException('User not approved or invalid credentials', HttpStatus.BAD_REQUEST);
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid email or password', HttpStatus.BAD_REQUEST);
    }
  
    const payload = { id: user._id, roles: user.roles, email: user.email };
    const token = jwt.sign(payload, this.jwtSecret, { expiresIn: process.env.JWT_EXPIRES });
  
    return { accessToken: token };
  }

    // IF ADMIN APPROVED 

    async approveUser(userId: string): Promise<User> {
      const user = await this.authModel.findById(userId).exec();
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    
      user.isApproved = true;  // Approve the user
      return user.save();
    }
  
}
