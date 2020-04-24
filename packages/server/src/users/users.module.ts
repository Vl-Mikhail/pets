import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { usersProviders } from './users.providres';
import { UsersResolver } from './users.resolver';
import { DatabaseModule } from '../database/database.module';
import { EmailScalar } from '../common/email.scalar';

@Module({
  imports: [DatabaseModule],
  providers: [EmailScalar, UsersService, UsersResolver, ...usersProviders],
})
export class UserModule {}
