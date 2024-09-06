import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { EnginevModule } from './enginev/enginev.module';

@Module({
  imports: [UserModule, EnginevModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
