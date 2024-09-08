import { Body, Controller, Logger, Param, Post } from '@nestjs/common';
import { EngineVContext } from './types/enginev.types';
import { StartDto } from './start.dto';
import { EnginevService } from './enginev.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { MyLogger } from 'src/logger';

@ApiTags('nginv')
@Controller('enginev')
export class EnginevController {
  constructor(
    private readonly engineV: EnginevService,
    private readonly logger: MyLogger,
  ) {}

  @Post('/start')
  async start(@Body() startDto: StartDto): Promise<EngineVContext> {
    return await this.engineV.start({
      request: {
        request_type: 'start',
        component_description: startDto.description,
      },
    });
  }
}
