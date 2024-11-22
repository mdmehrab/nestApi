import {
  IsString,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEmpty,
} from 'class-validator';
import { User } from 'src/auth/schema/user.schema';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEmpty({ message: 'You can not pass user id.' })
  readonly user: User;

  @IsNumber()
  duration: number;

  @IsOptional()
  @IsArray()
  category: string[];

  @IsArray()
  @IsEnum(['Beginner', 'Intermediate', 'Advanced'], { each: true })
  level: string[];

  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean = false;

  @IsOptional()
  @IsArray()
  tags: string[];
}
