import { NotFoundException } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  Subscription,
  ID,
} from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { UsersArgs } from './dto/users.args';
import { CreateUserInput } from './dto/create-user.input';

const pubSub = new PubSub();

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => User)
  async user(@Args({ name: 'id', type: () => ID }) id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException(id);
    }
    return user;
  }

  @Query((returns) => [User], { nullable: true })
  users(@Args() usersArgs: UsersArgs): Promise<User[]> {
    return this.usersService.findAll(usersArgs);
  }

  @Mutation((returns) => User)
  async createUser(@Args('input') newUserData: CreateUserInput): Promise<User> {
    const user = await this.usersService.create(newUserData);
    pubSub.publish('userAdded', { userAdded: user });
    return user;
  }

  @Mutation((returns) => User)
  async updateUser(
    @Args({ name: 'id', type: () => ID }) id: string,
    @Args('input') newUserData: CreateUserInput,
  ): Promise<User> {
    const user = await this.usersService.create(newUserData);
    pubSub.publish('userAdded', { userAdded: user });
    return user;
  }

  @Mutation((returns) => User)
  async deleteUser(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<User> {
    return this.usersService.remove(id);
  }

  @Subscription((returns) => User)
  userAdded() {
    return pubSub.asyncIterator('userAdded');
  }
}
