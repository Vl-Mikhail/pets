import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';
import { Email } from 'src/common/email.scalar';

@ObjectType()
export class User extends Document {
  @Field(type => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  age: number;

  @Field()
  email: Email;
}