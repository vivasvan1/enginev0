import { Module } from '@nestjs/common';
import { EnginevController } from './enginev.controller';
import { EnginevService } from './enginev.service';

@Module({
  controllers: [EnginevController],
  providers: [EnginevService],
})
export class EnginevModule {}
