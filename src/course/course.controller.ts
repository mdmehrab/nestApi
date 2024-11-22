
import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course } from './schema/course.schema';
import { AuthGuard } from 'src/auth/middleware/auth.guard';


@Controller('courses')  
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // Route for creating a course
  @Post('/create')
   @UseGuards(AuthGuard)
  async create(@Body() createCourseDto: CreateCourseDto,  @Req() req): Promise<Course> {
    
    return this.courseService.create(createCourseDto, req.user);
  }

 
}
