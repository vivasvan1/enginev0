import { MyLogger } from 'src/logger';
import { Module } from '@nestjs/common';

// Import controllers
import { EnginevController } from './enginev.controller';

// Import services
import { EnginevService } from './enginev.service';
import { CollectUiComponentsFromDescriptionService } from './pipeline/1-collect-ui-components-from-desc/collect-ui-component-from-desc';
import { CollectUiIconsFromDescriptionService } from './pipeline/2-collect-ui-icons-from-desc/collect-ui-icons-from-desc';
import { GenerateDesignJsonFromDescService } from './pipeline/3-generate-design-json-from-desc/generate-design-json-from-desc.service';
import { GenerateCodeFromDesignJsonService } from './pipeline/4-generare-code-from-design-json/generate-code-from-design-json.service';

@Module({
  imports: [],
  controllers: [EnginevController],
  providers: [
    // Main Service
    EnginevService,

    // Pipeline Services
    CollectUiComponentsFromDescriptionService,
    CollectUiIconsFromDescriptionService,
    GenerateDesignJsonFromDescService,
    GenerateCodeFromDesignJsonService,

    // Other Services
    MyLogger,
  ],
})
export class EnginevModule {}
