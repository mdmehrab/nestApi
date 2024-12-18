import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR',
}

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop()
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  profileImg?: string;

  @Prop({ type: String, enum: Roles, default: Roles.USER })
  roles?: Roles;

  @Prop({ required: true })
  mobileNumber: string;

  @Prop({ required: true, enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop({ required: true })
  country: string;

  @Prop({ default: false })  // New field for approval status
  isApproved: boolean;  // Initially, users are not approved
}

export const UserSchema = SchemaFactory.createForClass(User);
