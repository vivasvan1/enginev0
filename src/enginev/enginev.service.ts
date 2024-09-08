import { Injectable } from '@nestjs/common';
import { GenerateDesignJsonFromDescService } from './pipeline/generate-design-json-from-desc/generate-design-json-from-desc.service';
import {
  EngineVContext,
  EngineVRequest,
  EngineVStartRequest,
} from './types/enginev.types';
import {
  GenerateJSONRequest,
  GenerateJSONResponse,
} from './pipeline/generate-design-json-from-desc/types/generatejson.types';
import { CollectUiComponentsFromDescriptionService } from './pipeline/collect-ui-components-from-desc/collect-ui-component-from-desc';
import {
  CollectUiComponentRequest,
  CollectUiComponentResponse,
} from './pipeline/collect-ui-components-from-desc/types/collect-ui-component-from-desc.types';
import {
  CollectUiIconsRequest,
  CollectUiIconsResponse,
} from './pipeline/collect-ui-icons-from-desc/types/collect-ui-icons-from-desc.types';
import { CollectUiIconsFromDescriptionService } from './pipeline/collect-ui-icons-from-desc/collect-ui-icons-from-desc';
import { UIComponent } from './types/elements.types';
import { EngineVError } from './types/errors';

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
    // private readonly generateComponentService: GenerateComponentService
  ) {
    // do initialization here
  }

  reset() {
    this.ctx.requestResponses = [];
  }

  async start({
    request,
  }: {
    request: EngineVStartRequest;
  }): Promise<EngineVContext> {
    console.log(request);
    this.reset();

    const collected_ui_components = await this.collectUiComponents(this.ctx, {
      request_type: 'collect_ui_components',
      component_description: request.component_description,
    }).retry(3);

    if (collected_ui_components.status === 'error') {
      throw new EngineVError(
        'CollectUiComponentFailed:',
        'Failed to collect UI components',
      );
    }

    const collected_ui_icons = await this.collectUiIcons(this.ctx, {
      request_type: 'collect_ui_icons',
      component_description: request.component_description,
    }).retry(3);

    if (collected_ui_icons.status === 'error') {
      throw new EngineVError(
        'CollectUiIconsFailed:',
        'Failed to collect UI icons',
      );
    }

    const design_json = await this.generateJSONfromDescription(this.ctx, {
      request_type: 'generate_json',
      component_description: request.component_description,
      collected_ui_components: collected_ui_components.data.ui_components,
      collected_ui_components_reasons: collected_ui_components.data.reasons,
      collected_ui_icons: collected_ui_icons.data.icon_names,
      collected_ui_icons_reasons: collected_ui_icons.data.reasons,
    });

    return this.ctx;
  }

  async repeatPrevious() {
    return this.ctx;
  }

  async next({
    request,
  }: {
    request: EngineVRequest;
  }): Promise<EngineVContext> {
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
    req: GenerateJSONRequest,
  ): Promise<GenerateJSONResponse> {
    const res = await this.generateJsonService.run(ctx, req);
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
