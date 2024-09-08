import 'src/utils/promise.extensions';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { EnginevModule } from './enginev/enginev.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, EnginevModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
