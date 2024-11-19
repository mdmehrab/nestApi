import { IsString, IsEmail, IsEnum, IsArray, IsPhoneNumber, IsOptional, IsIn } from 'class-validator';
import { Roles } from '../schema/user.schema';


export class RegisterUserDto {
  @IsString()
  username: string;

  @IsEmail()
  @IsOptional() 
  email: string;

  @IsString()
  password: string;

  @IsEnum(Roles) 
  @IsOptional()
  roles?: Roles;

  @IsString()
  mobileNumber: string;

  @IsIn(['male', 'female', 'other'])
  gender: string;

  @IsString()
  country: string;
}
