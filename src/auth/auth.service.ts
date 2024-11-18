import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly authModel: Model<User>,
  ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
      const { password, ...userData } = createUserDto;
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const createdUser = new this.authModel({
        ...userData,
        password: hashedPassword,
      });
  
      return createdUser.save();
    }
    
  async findAll(): Promise<User[]> {
    return this.authModel.find().exec();
  }
}
