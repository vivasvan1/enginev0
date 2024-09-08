import { Injectable } from '@nestjs/common';
import ollama from 'ollama';
import { config as dotenvConfig } from 'dotenv';
import { EngineVContext } from '../../types/enginev.types';
import {
  GenerateCodeFromDesignJsonRequest,
  GenerateCodeFromDesignJsonResponse,
} from './types/generate-code-from-design-json.types';
import { MyLogger } from 'src/logger';

@Injectable()
export class GenerateCodeFromDesignJsonService {
  private ollama_config = dotenvConfig({
    path: process.env.OLLAMA_CONFIG_PATH,
  });

  private system_message =
    `You are a React+Tailwind developer. You have been given a name and description of a component to create and potentially useful UI components and icons with examples of which you can make use of.\n` +
    `Please generate the working code based on the provided information.\n` +
    `Return only the code. DO NOT return anything else.\n` +
    `Make sure to use the provided component and description.\n` +
    `Do not add any extra text description or comments besides the code. Your answer contains code only ! component code only !\n`;

  constructor(private readonly logger: MyLogger) {}

  async run(
    context: EngineVContext,
    request: GenerateCodeFromDesignJsonRequest,
  ): Promise<GenerateCodeFromDesignJsonResponse> {
    const component_design_message =
      `Component Name: ${request.design_json.component_name}\n` +
      `Component Description: ${request.design_json.component_description}\n` +
      `Useful UI Components: \n${request.design_json.required_ui_components
        .map((component, index) => {
          const component_string = `  ${index}. Name: ${component.name} \n  - Desc: ${component.description} \n   - Example code: \`\`\`jsx\n${component.demo_code}\n\`\`\`\n`;
          return component_string;
        })
        .join('')}\n` +
      `Reasons: ${request.design_json.reasons_ui_components.join(', ')}\n\n` +
      `Useful UI Icons: ${request.design_json.required_ui_icons.map((icon) => icon.name).join(', ')}\n` +
      `Reasons: ${request.design_json.reasons_ui_icons.join(', ')}\n` +
      `Return only the code. DO NOT return anything else.\n` +
      `Important :\n` +
      `- Make sure you import provided components libraries and icons that are provided to you if you use them !\n` +
      `- Tailwind classes should be written directly in the elements className tag. DO NOT WRITE ANY CSS OUTSIDE OF CLASSES. DO NOT USE ANY <style> IN THE CODE ! CLASSES STYLING ONLY !\n` +
      `- Do not use libraries or imports except what is provided in this task; otherwise it would crash the component because not installed. Do not import extra libraries besides what is provided above !\n` +
      `- DO NOT HAVE ANY DYNAMIC DATA OR DATA PROPS ! Components are meant to be working as is without supplying any variable to them when importing them ! Only write a component that render directly with placeholders as data, component not supplied with any dynamic data.\n` +
      `- DO NOT HAVE ANY DYNAMIC DATA OR DATA PROPS ! ` +
      `- Only write the code for the component; Do not write extra code to import it! The code will directly be stored in an individual .tsx file !\n` +
      `Write the contents of this component.jsx as the creative and component genius you are.\n`;

    const ai_response = await ollama.chat({
      model: this.ollama_config.parsed.MODEL,
      messages: [
        {
          role: 'system',
          content: this.system_message,
        },
        {
          role: 'user',
          content: component_design_message,
        },
      ],
    });

    this.logger.log(
      ai_response.message.content,
      'generate-code-from-design-json',
    );

    return {
      response_type: 'generate_code_from_design_json',
      status: 'success',
      data: {
        code: ai_response.message.content,
      },
    };
  }
}
