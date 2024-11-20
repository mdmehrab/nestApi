import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';


@Schema({
  timestamps: true,  // Automatically adds createdAt and updatedAt fields
})
export class Course extends Document {
  @Prop({ required: true })
  title: string;  // The title of the course

  @Prop({ required: true })
  description: string;  // A brief description of the course

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  author: MongooseSchema.Types.ObjectId;  // Reference to the User schema (author as ObjectId)

  @Prop({ required: true })
  duration: number;  // Duration in hours

  @Prop([String])  // Categories for the course (e.g., Programming, Design)
  category: string[];

  @Prop({ required: true })
  level: string[];  // Levels of the course (e.g., Beginner, Intermediate, Advanced)

  @Prop({ required: true })
  price: number;  // Price of the course

  @Prop({ default: false })
  isPublished: boolean;  // Whether the course is published or not

  @Prop([String])
  tags: string[];  // Tags for course categorization
}

export const CourseSchema = SchemaFactory.createForClass(Course);
