// src/course/course.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course } from './schema/course.schema';
import { User } from 'src/auth/schema/user.schema';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
  ) {}

  // create course
  async create(createCourseDto: CreateCourseDto, user): Promise<Course> {
    const data = { ...createCourseDto, user: user.id };
    const newCourse = await this.courseModel.create(data);
    return newCourse;
  }
}
