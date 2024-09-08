import { Injectable, Logger } from '@nestjs/common';
import ollama from 'ollama';
import { config as dotenvConfig } from 'dotenv';
import {
  CollectUiIconsRequest,
  CollectUiIconsResponse,
} from './types/collect-ui-icons-from-desc.types';
import iconNamesJson from 'lib/scripts/icon_names.json';
import iconCodesJson from 'lib/scripts/icon_codes.json';
import { MyLogger } from 'src/logger';
import { EngineVContext } from 'src/enginev/types/enginev.types';
import Fuse from 'fuse.js';

@Injectable()
export class CollectUiIconsFromDescriptionService {
  private readonly ollamaConfig = dotenvConfig({
    path: process.env.OLLAMA_CONFIG_PATH,
  }).parsed;

  private readonly logger: MyLogger;
  private readonly systemMessage: string;
  private readonly availableIconsMessage: string;
  private readonly fuse: Fuse<string>;

  constructor(logger: MyLogger) {
    this.logger = logger;
    this.systemMessage =
      `You are a UI component designer. You have been given a description of a UI component.\n` +
      `Please select the Font Awesome react-icons you think can be utilized for the provided component description. ONLY USE FONT AWESOME ICONS.\n` +
      `Also think about the reason why you think so.\n\n` +
      `Return JSON only. DO NOT return anything else.\n\n` +
      `Your response should be in the following format:\n` +
      `{"icon_names":[...], "reasons":[...]}\n\n` +
      `Example of Correct Response:\n` +
      `{"icon_names":["FaHeart"], "reasons":["Used to show the user's like"]}\n\n`;

    this.availableIconsMessage =
      `Available icons list: \n` + `[${iconNamesJson.join(', ')}]\n\n`;

    // Fuzzy search logic using Fuse.js
    this.fuse = new Fuse(iconNamesJson, {
      includeScore: true,
      threshold: 0.4, // Adjust this threshold for tighter or looser matching
    });
  }

  /**
   * Main method to run the service that collects UI icons based on the component description.
   */
  async run(
    context: EngineVContext,
    request: CollectUiIconsRequest,
  ): Promise<CollectUiIconsResponse> {
    try {
      // Step 1: Call the AI service and log the input/output
      const aiResponse = await this.getAiResponse(
        request.component_description,
      );
      this.logger.log('AI Response:', aiResponse);

      // Step 2: Parse the AI response
      const parsedResponse = this.parseAiResponse(aiResponse.message.content);
      this.logger.log('Parsed Response:', parsedResponse);

      // Step 3: Filter out icons that are not available in the icon codes JSON
      const filteredIcons = parsedResponse.icon_names
        .map((icon_name: string) => {
          // Perform fuzzy search using Fuse.js
          const result = this.fuse.search(icon_name);

          // If a result is found, take the first one (best match)
          if (result.length > 0) {
            return result[0].item;
          } else {
            return null;
          }
        })
        .filter((icon_name: string | null) => icon_name !== null);

      return {
        response_type: 'collect_ui_icons',
        status: 'success',
        data: {
          icon_names: filteredIcons.map((icon_name: string) => {
            return {
              name: icon_name,
              demo_code: iconCodesJson[icon_name],
            };
          }),
          reasons: parsedResponse.reasons,
        },
      };
    } catch (error) {
      this.logger.error('Error in run method:', error.message, error.stack);
      throw new Error('Failed to collect UI icons from description.');
    }
  }

  /**
   * Helper method to call the AI service with the relevant messages.
   */
  private async getAiResponse(componentDescription: string): Promise<any> {
    try {
      const aiResponse = await ollama.chat({
        model: this.ollamaConfig.MODEL,
        messages: [
          {
            role: 'system',
            content: this.systemMessage,
          },
          {
            role: 'user',
            content: this.availableIconsMessage,
          },
          {
            role: 'user',
            content: `Component description: ${componentDescription}`,
          },
        ],
      });

      return aiResponse;
    } catch (error) {
      this.logger.error(
        'Error calling AI service:',
        error.message,
        error.stack,
      );
      throw new Error('AI service request failed.');
    }
  }

  /**
   * Helper method to parse AI response content into a usable JSON format.
   */
  private parseAiResponse(responseContent: string): {
    icon_names: string[];
    reasons: string[];
  } {
    try {
      return JSON.parse(responseContent);
    } catch (error) {
      this.logger.error('Error parsing AI response:', responseContent);
      throw new Error('Failed to parse AI response JSON.');
    }
  }
}
