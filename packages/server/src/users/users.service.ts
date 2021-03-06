import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { UsersArgs } from './dto/users.args';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(@Inject('USER_MODEL') private readonly userModel: Model<User>) {}

  async create(createUser: CreateUserInput): Promise<User> {
    const createdUser = new this.userModel(createUser);
    return createdUser.save();
  }

  async update(id: string, createUser: CreateUserInput): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, createUser, { new: true })
      .exec();
  }

  async findAll(usersArgs: UsersArgs): Promise<User[]> {
    const { skip, take } = usersArgs;
    return this.userModel.find().skip(skip).limit(take).exec();
  }

  async countUsers(): Promise<number> {
    return this.userModel.countDocuments({});
  }

  async findOneById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndRemove(id);
  }
}
