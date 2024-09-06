import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { Logger } from './logger.provider';
import { UserController } from './user.controller';

@Module({
  providers: [UserService, Logger],
  controllers: [UserController],
})
export class UserModule {}
