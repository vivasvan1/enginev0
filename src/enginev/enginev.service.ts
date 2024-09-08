import { Injectable } from '@nestjs/common';
import { GenerateDesignJsonFromDescService } from './pipeline/3-generate-design-json-from-desc/generate-design-json-from-desc.service';
import {
  EngineVContext,
  EngineVRequest,
  EngineVStartRequest,
} from './types/enginev.types';
import {
  GenerateDesignJsonFromDescriptionRequest,
  GenerateDesignJsonFromDescriptionResponse,
} from './pipeline/3-generate-design-json-from-desc/types/generate-design-json-from-desc.types';
import { CollectUiComponentsFromDescriptionService } from './pipeline/1-collect-ui-components-from-desc/collect-ui-component-from-desc';
import {
  CollectUiComponentRequest,
  CollectUiComponentResponse,
} from './pipeline/1-collect-ui-components-from-desc/types/collect-ui-component-from-desc.types';
import {
  CollectUiIconsRequest,
  CollectUiIconsResponse,
} from './pipeline/2-collect-ui-icons-from-desc/types/collect-ui-icons-from-desc.types';
import { CollectUiIconsFromDescriptionService } from './pipeline/2-collect-ui-icons-from-desc/collect-ui-icons-from-desc';
import { UIComponent } from './types/elements.types';
import { EngineVError } from './types/errors';
import { MyLogger } from 'src/logger';
import { GenerateCodeFromDesignJsonService } from './pipeline/4-generare-code-from-design-json/generate-code-from-design-json.service';
import { GenerateCodeFromDesignJsonRequest } from './pipeline/4-generare-code-from-design-json/types/generate-code-from-design-json.types';

enum EngineVState {
  Loading = 'loading',
  Ready = 'ready',
  Start = 'start',
  Next = 'next',
}

@Injectable()
export class EnginevService {
  private ctx: EngineVContext = {
    requestResponses: [],
  };
  constructor(
    private readonly collectUiComponentsService: CollectUiComponentsFromDescriptionService,
    private readonly collectUiIconsService: CollectUiIconsFromDescriptionService,
    private readonly generateJsonService: GenerateDesignJsonFromDescService,
    private readonly generateCodeFromDesignJsonService: GenerateCodeFromDesignJsonService,
    private readonly logger: MyLogger,
    // private readonly generateComponentService: GenerateComponentService
  ) {
    // do initialization here
  }

  reset() {
    this.ctx = {
      requestResponses: [],
    };
  }

  async start({
    request,
  }: {
    request: EngineVStartRequest;
  }): Promise<EngineVContext> {
    this.reset();

    const collected_ui_components_res = await this.collectUiComponents(
      this.ctx,
      {
        request_type: 'collect_ui_components',
        component_description: request.component_description,
      },
    ).retry(3);

    if (collected_ui_components_res.status === 'error') {
      throw new EngineVError(
        'CollectUiComponentFailed:',
        'Failed to collect UI components',
      );
    }

    const collected_ui_icons_res = await this.collectUiIcons(this.ctx, {
      request_type: 'collect_ui_icons',
      component_description: request.component_description,
    }).retry(3);

    if (collected_ui_icons_res.status === 'error') {
      throw new EngineVError(
        'CollectUiIconsFailed:',
        'Failed to collect UI icons',
      );
    }

    const design_json_res = await this.generateJSONfromDescription(this.ctx, {
      request_type: 'generate_json',
      component_description: request.component_description,
      collected_ui_components: collected_ui_components_res.data.ui_components,
      collected_ui_components_reasons: collected_ui_components_res.data.reasons,
      collected_ui_icons: collected_ui_icons_res.data.icon_names,
      collected_ui_icons_reasons: collected_ui_icons_res.data.reasons,
    }).retry(3);

    if (design_json_res.status === 'error') {
      throw new EngineVError(
        'GenerateDesignJsonFailed:',
        'Failed to generate design json',
      );
    }

    const code_res = await this.generateCodeFromDesignJson(this.ctx, {
      request_type: 'generate_code_from_design_json',
      design_json: design_json_res.data,
    });

    this.logger.log(code_res);

    if (code_res.status === 'error') {
      throw new EngineVError(
        'GenerateCodeFromDesignJsonFailed:',
        'Failed to generate code from design json',
      );
    }

    return this.ctx;
  }

  async repeatPrevious() {
    return this.ctx;
  }

  private async collectUiComponents(
    ctx: EngineVContext,
    req: CollectUiComponentRequest,
  ): Promise<CollectUiComponentResponse> {
    const res = await this.collectUiComponentsService.run(ctx, req);
    this.handleRequestResponse(ctx, req, res);

    if (res.status === 'error') {
      throw new EngineVError(
        'CollectUiComponentFailed:',
        'Failed to collect UI components',
      );
    }

    return res;
  }

  private async collectUiIcons(
    ctx: EngineVContext,
    req: CollectUiIconsRequest,
  ): Promise<CollectUiIconsResponse> {
    const res = await this.collectUiIconsService.run(ctx, req);
    this.handleRequestResponse(ctx, req, res);
    return res;
  }

  private async generateJSONfromDescription(
    ctx: EngineVContext,
    req: GenerateDesignJsonFromDescriptionRequest,
  ): Promise<GenerateDesignJsonFromDescriptionResponse> {
    const res = await this.generateJsonService.run(ctx, req);
    this.handleRequestResponse(ctx, req, res);
    return res;
  }

  private async generateCodeFromDesignJson(
    ctx: EngineVContext,
    req: GenerateCodeFromDesignJsonRequest,
  ) {
    const res = await this.generateCodeFromDesignJsonService.run(ctx, req);
    this.handleRequestResponse(ctx, req, res);
    return res;
  }

  private handleRequestResponse(
    ctx: EngineVContext,
    req: any,
    res: any,
  ): EngineVContext {
    ctx.requestResponses.push({
      request: req,
      response: res,
    });
    return ctx;
  }
}
