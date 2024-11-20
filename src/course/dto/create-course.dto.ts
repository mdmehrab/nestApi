
import { IsString, IsArray, IsEnum, IsNumber, IsOptional, IsBoolean } from 'class-validator';


export class CreateCourseDto {
  @IsString()
  title: string;  // Course title

  @IsString()
  description: string;  // Course description

  @IsString()
  author: string;  // The author should be a string (user's ObjectId as string)

  @IsNumber()
  duration: number;  // Course duration in hours

  @IsOptional()  // Category is optional
  @IsArray()
  category: string[];  // Category of the course

  @IsArray()
  @IsEnum(['Beginner', 'Intermediate', 'Advanced'], { each: true })
  level: string[];  // Level of the course

  @IsNumber()
  price: number;  // Price of the course

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean = false;  // Whether the course is published

  @IsOptional()
  @IsArray()
  tags: string[];  // Tags related to the course
}
