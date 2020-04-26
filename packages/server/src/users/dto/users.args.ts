import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class UsersArgs {
  @Field((type) => Int, { nullable: true })
  @Min(0)
  skip?: number = 0;

  @Field((type) => Int, { nullable: true })
  @Min(1)
  @Max(50)
  take?: number = 5;
}
