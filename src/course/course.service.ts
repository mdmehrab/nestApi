import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

   // Find a single course by ID
   async findOne(id: string): Promise<Course> {
    // Check if the ID is a valid ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    try {
      const course = await this.courseModel.findById(id).populate('user').exec();
      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      return course;
    } catch (error) {
      // If there's any error in finding the course, throw a general error
      throw new Error('An error occurred while fetching the course');
    }
  }
  
}
