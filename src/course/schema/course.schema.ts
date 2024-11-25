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

  @Prop()
  imageUrl?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true })
  duration: number; 

  @Prop([String]) 
  category: string[];

  @Prop({ required: true })
  level: string[]; 

  @Prop({
    required: true,
    type: {
      currentPrice: { type: Number, required: true },
      originalPrice: { type: Number, required: true },
    },
    _id: false, 
  })
  price: {
    currentPrice: number;
    originalPrice: number;
  };

  @Prop({ default: 0, min: 0, max: 5 })
  rating: number; 

  @Prop({ default: false })
  isPublished: boolean;  

  @Prop({ default: false })
  bestSeller: boolean;

  @Prop([String])
  tags: string[];  
}

export const CourseSchema = SchemaFactory.createForClass(Course);
