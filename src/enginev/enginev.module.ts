import { Module, Logger } from '@nestjs/common';
import { EnginevController } from './enginev.controller';
import { EnginevService } from './enginev.service';
import { GenerateDesignJsonFromDescService } from './pipeline/generate-design-json-from-desc/generate-design-json-from-desc.service';
import { CollectUiComponentsFromDescriptionService } from './pipeline/collect-ui-components-from-desc/collect-ui-component-from-desc';
import { CollectUiIconsFromDescriptionService } from './pipeline/collect-ui-icons-from-desc/collect-ui-icons-from-desc';
import { MyLogger } from 'src/logger';

@Module({
  imports: [],
  controllers: [EnginevController],
  providers: [
    EnginevService,
    GenerateDesignJsonFromDescService,
    CollectUiComponentsFromDescriptionService,
    CollectUiIconsFromDescriptionService,
    MyLogger,
  ],
})
export class EnginevModule {}
