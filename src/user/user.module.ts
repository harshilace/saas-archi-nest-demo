import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';

@Module({
  // imports: [TypeOrmModule.forFeature([User])],
  imports: [TypeOrmModule.forFeature([User], 'user')],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
