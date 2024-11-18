import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto'; 
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly authModel: Model<User>,
  ) {}

  // register user 
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, roles, ...userData } = createUserDto;

    const role = roles || 'USER';

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = new this.authModel({
      ...userData,
      password: hashedPassword,
      roles: role,
    });

    return createdUser.save();
  }



  async login(loginDto: LoginDto): Promise<{ user: User }> {
    const { email, password } = loginDto;
  
    try {

      const user = await this.authModel.findOne({ email }).exec(); 
      if (!user) {
        throw new HttpException('Invalid email or password', HttpStatus.BAD_REQUEST);
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException('Invalid email or password', HttpStatus.BAD_REQUEST);
      }
  
      const { password: _, ...others } = user.toObject(); 
  
      return { user: others as User };
    } catch (error) {
      throw error;
    }
  }
  
  
  
}
