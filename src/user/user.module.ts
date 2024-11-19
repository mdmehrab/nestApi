import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';  // Import UserService
import { AuthModule } from '../auth/auth.module';  // Import AuthModule
import { AuthMiddleware } from '../auth/middleware/authMiddleware';  // Import AuthMiddleware
import { UserSchema } from '../auth/schema/user.schema';  // Import UserSchema

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), // Register User schema
    AuthModule, // Use AuthModule for shared logic (e.g., token handling, user auth)
  ],
  controllers: [UserController], // Attach UserController
  providers: [UserService], // Provide UserService for user-specific logic
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('users/profile');  // Protect /users/profile route
  }
}
