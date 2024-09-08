import { Injectable, Logger } from '@nestjs/common';
import ollama, { Tool } from 'ollama';
import { config as dotenvConfig } from 'dotenv';
import {
  CollectUiComponentRequest,
  CollectUiComponentResponse,
} from './types/collect-ui-component-from-desc.types';
import shadcn_processed_json from 'src/enginev/component-library/shadcn-processed.json';
import { MyLogger } from 'src/logger';
import { EngineVContext } from 'src/enginev/types/enginev.types';
import { UIComponent } from 'src/enginev/types/elements.types';

@Injectable()
export class CollectUiComponentsFromDescriptionService {
  private ollama_config = dotenvConfig({
    path: process.env.OLLAMA_CONFIG_PATH,
  });

  private collect_ui_components_system_message =
    `Your task is to generate a JSON schema for the user's request.\n` +
    `Please follow the format specified in the user's description.\n`;

  private available_components_message =
    `Please select components which you think can be utilized for the provided component description. Also think about the reason why you think so.\nFollowing Components are available for ready-use:\n` +
    `${Object.values(shadcn_processed_json)
      .map((component) => `${component.name} - ${component.description}`)
      .join('\n ')}`;

  constructor(private readonly logger: MyLogger) {}

  async run(
    ctx: EngineVContext,
    request: CollectUiComponentRequest,
  ): Promise<CollectUiComponentResponse> {
    const ai_response = await ollama.chat({
      model: this.ollama_config.parsed.MODEL,
      messages: [
        {
          role: 'system',
          content: this.collect_ui_components_system_message,
        },
        {
          role: 'user',
          content: this.available_components_message,
        },
        {
          role: 'user',
          content: `Component description: ${request.component_description}`,
        },
      ],
      tools: [collect_ui_components_tool_call],
    });

    const function_args = ai_response.message.tool_calls[0].function.arguments;
    this.logger.log(function_args);

    const exisiting_components: string[] = function_args.ui_components.filter(
      (component_name: string) =>
        Object.keys(shadcn_processed_json).includes(component_name),
    );
    const ui_components: UIComponent[] = exisiting_components.map(
      (component_name: string) => {
        return {
          name: component_name,
          description: shadcn_processed_json[component_name].description,
          demo_code: shadcn_processed_json[component_name].demo,
          examples: shadcn_processed_json[component_name].examples,
          required: true,
        };
      },
    );

    return {
      response_type: 'collect_ui_components',
      status: 'success',
      data: {
        ui_components: ui_components,
        reasons: function_args.reasons,
      },
    };
  }
}
const collect_ui_components_tool_call: Tool = {
  type: 'function',
  function: {
    name: 'collect_ui_components',
    description:
      'Collect the UI components which can be used for building the component.',
    parameters: {
      type: 'object',
      properties: {
        ui_components: {
          type: 'array',
          description:
            'UI components which can be used for building the component.',
          enum: Object.keys(shadcn_processed_json),
        },
        reasons: {
          type: 'array',
          description:
            'Array of reasons why each of the above given UI components are required',
        },
      },
      required: ['ui_components', 'reasons'],
    },
  },
};
