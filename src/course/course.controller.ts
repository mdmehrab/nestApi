// src/course/course.controller.ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course } from './schema/course.schema';
import { AuthGuard } from 'src/auth/middleware/auth.guard';


@Controller('courses')  // Define route as '/courses'
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // Route for creating a course
  @Post('/create')
   // Get user profile
   @UseGuards(AuthGuard)
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.courseService.create(createCourseDto);
  }

 
}
