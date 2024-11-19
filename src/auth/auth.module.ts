import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserSchema } from './schema/user.schema';
import { AuthMiddleware } from './middleware/authMiddleware'; // Import the middleware

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),  // Mongoose schema for User
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
