import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { AuthMiddleware } from '../auth/middleware/authMiddleware';
import { UserSchema } from '../auth/schema/user.schema';
import { JwtModule } from '@nestjs/jwt'; 
import { RolesGuard } from 'src/auth/middleware/roles.guard'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AuthModule,
    JwtModule.register({ 
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: process.env.JWT_EXPIRES }, 
    }),
  ],
  controllers: [UserController],
  providers: [UserService, RolesGuard],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('users/profile');
  }
}
