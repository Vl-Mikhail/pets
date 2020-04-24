import { Field, InputType } from '@nestjs/graphql';
import { Length, MaxLength } from 'class-validator';
import { Email } from 'src/common/email.scalar';

@InputType()
export class CreateUserInput {
  @Field()
  @MaxLength(30)
  readonly name: string;

  @Field()
  @Length(5, 100)
  readonly email: Email;
}