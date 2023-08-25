import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from '@/user/user.controller';
import { UserService } from '@/user/user.service';
import { UserEntity } from '@/user/user.entity';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  exports: [UserService],
})
export class UserModule {}
