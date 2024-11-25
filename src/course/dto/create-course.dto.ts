import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEmpty,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { User } from 'src/auth/schema/user.schema';

class PriceDto {
  @IsNumber()
  currentPrice: number;

  @IsNumber()
  originalPrice: number;
}


export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEmpty({ message: 'You can not pass user id.' })
  readonly user: User;

  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  duration: number;

  @IsOptional()
  @IsArray()
  category: string[];

  @IsArray()
  @IsEnum(['Beginner', 'Intermediate', 'Advanced'], { each: true })
  level: string[];

  @ValidateNested()
  @Type(() => PriceDto)
  readonly price: PriceDto; 


  @IsOptional()
  @IsBoolean()
  readonly bestSeller?: boolean; 

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean = false;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  readonly rating?: number;

  @IsOptional()
  @IsArray()
  tags: string[];
}
