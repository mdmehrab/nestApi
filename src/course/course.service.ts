import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course } from './schema/course.schema';

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

  // get all courses 
  async findAll(): Promise<Course[]> {
    return this.courseModel.find().populate('user').exec(); 
  }
  
}
