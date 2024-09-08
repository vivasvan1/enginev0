import { Injectable } from '@nestjs/common';
import ollama from 'ollama';
import { config as dotenvConfig } from 'dotenv';
import { EngineVContext } from '../../types/enginev.types';
import {
  GenerateDesignJsonFromDescriptionRequest,
  GenerateDesignJsonFromDescriptionResponse,
} from './types/generate-design-json-from-desc.types';
import { MyLogger } from 'src/logger';

@Injectable()
export class GenerateDesignJsonFromDescService {
  private ollama_config = dotenvConfig({
    path: process.env.OLLAMA_CONFIG_PATH,
  });

  private system_message =
    `Your task is to generate a JSON schema for the user's request.\n` +
    `Please follow the format specified in the user's description.\n` +
    `You can ask clarifying questions if needed.`;

  constructor(private readonly logger: MyLogger) {}

  async run(
    context: EngineVContext,
    request: GenerateDesignJsonFromDescriptionRequest,
  ): Promise<GenerateDesignJsonFromDescriptionResponse> {
    const ai_response = await ollama.chat({
      model: this.ollama_config.parsed.MODEL,
      messages: [
        {
          role: 'system',
          content: this.system_message,
        },
        {
          role: 'user',
          content: request.component_description,
        },
      ],
      tools: [tool],
    });

    const function_args = ai_response.message.tool_calls[0].function.arguments;
    this.logger.log(function_args, 'generate-design-json-from-desc');
    const generate_json_data = {
      component_name: function_args.component_name,
      component_description: function_args.component_description,

      required_ui_components: request.collected_ui_components,
      reasons_ui_components: request.collected_ui_components_reasons,

      required_ui_icons: request.collected_ui_icons,
      reasons_ui_icons: request.collected_ui_icons_reasons,
    };

    return {
      response_type: 'generate_json',
      status: 'success',
      data: generate_json_data,
    };
  }
}

const tool = {
  type: 'function',
  function: {
    name: 'generate_json_from_description',
    description:
      'generate the design json from the description of the component.',
    parameters: {
      type: 'object',
      properties: {
        component_name: {
          type: 'string',
          description: 'The clear and descriptive name of the component',
        },
        component_description: {
          type: 'string',
          description:
            'Describe in plain english the style and use case of the component.',
        },
      },
      required: ['component_name', 'component_description'],
    },
  },
};
