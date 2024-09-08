import { Body, Controller, Post } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

import { EngineVContext } from './types/enginev.types';
import { StartDto } from './start.dto';
import { EnginevService } from './enginev.service';
import { ApiTags } from '@nestjs/swagger';
import { MyLogger } from 'src/logger';

@ApiTags('nginv')
@Controller('enginev')
export class EnginevController {
  constructor(
    private readonly engineV: EnginevService,
    private readonly logger: MyLogger,
  ) {}

  @Post('/generate')
  async generate(@Body() startDto: StartDto): Promise<EngineVContext> {
    try {
      this.engineV.reset();
      return await this.engineV.start({
        request: {
          request_type: 'start',
          component_description: startDto.description,
        },
      });
    } catch (error) {
      this.logger.error('Error in generate', error);
      // Return an error response
      throw new HttpException(
        JSON.stringify(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
