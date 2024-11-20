
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { UserModule } from 'src/user/user.module';
import { Course, CourseSchema } from './schema/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    UserModule,  
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
