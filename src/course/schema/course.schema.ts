import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';


@Schema({
  timestamps: true,  
})
export class Course extends Document {
  @Prop({ required: true })
  title: string;  

  @Prop({ required: true })
  description: string; 

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true })
  duration: number; 

  @Prop([String]) 
  category: string[];

  @Prop({ required: true })
  level: string[]; 

  @Prop({ required: true })
  price: number; 

  @Prop({ default: false })
  isPublished: boolean;  

  @Prop([String])
  tags: string[];  
}

export const CourseSchema = SchemaFactory.createForClass(Course);
