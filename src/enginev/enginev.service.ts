import { Injectable } from '@nestjs/common';
import { EngineVContext } from './types/enginev.types';
import ollama from 'ollama';
import { config as dotenvConfig } from 'dotenv';

@Injectable()
export class EnginevService {
  private ollama_config = dotenvConfig({ "path": "src/config/.ollama" })
  private generate_json_tool_call = {
    'type': 'function',
    'function': {
      'name': 'generate_json_from_description',
      'description': 'generate the design json from the description of the component.',
      'parameters': {
        'type': 'object',
        'properties': {
          'component_name': {
            'type': 'string',
            'description': 'The name of the component',
          },
          'component_description': {
            'type': "string",
            'description': "Describe in plain english the style, use case of the component"
          },
          // TODO: Add in v2
          // 'theme_colors': {
          //   'type': 'array',
          //   'items': {
          //     'type': 'string'
          //   },
          //   'description': 'Optional array of theme colors'
          // },
          'required_ui_components': {
            'type': 'array',
            'items': {
              'type': 'object',
              'properties': {
                'name': {
                  'type': 'string',
                  'description': 'Name of the UI component'
                },
                'description': {
                  'type': 'string',
                  'description': 'Description of the UI component'
                },
                'demo_code': {
                  'type': 'string',
                  'description': 'Demo code for the UI component'
                },
                'examples': {
                  'type': 'array',
                  'items': {
                    'type': 'string',
                    'description': 'Examples of the UI component'
                  }
                },
                'required': {
                  'type': 'boolean',
                  'description': 'Whether the UI component is required'
                }
              },
              'required': [
                'name',
                'description',
                'demo_code',
                'examples',
                'required'
              ]
            },
            'description': 'Required UI components for the component'
          },
          'optional_ui_components': {
            'type': 'array',
            'items': {
              'type': 'object',
              'properties': {
                'name': {
                  'type': 'string',
                  'description': 'Name of the UI component'
                },
                'description': {
                  'type': 'string',
                  'description': 'Description of the UI component'
                },
                'demo_code': {
                  'type': 'string',
                  'description': 'Demo code for the UI component'
                },
                'examples': {
                  'type': 'array',
                  'items': {
                    'type': 'string',
                    'description': 'Examples of the UI component'
                  }
                },
                'required': {
                  'type': 'boolean',
                  'description': 'Whether the UI component is required'
                }
              },
              'required': [
                'name',
                'description',
                'demo_code',
                'examples',
                'required'
              ]
            },
            'description': 'Optional UI components for the component'
          },
          'required_icon_components': {
            'type': 'array',
            'items': {
              'type': 'object',
              'properties': {
                'name': {
                  'type': 'string',
                  'description': 'Name of the icon component'
                },
                'description': {
                  'type': 'string',
                  'description': 'Description of the icon component'
                },
                'demo_code': {
                  'type': 'string',
                  'description': 'Demo code for the icon component'
                }
              },
              'required': [
                'name',
                'description',
                'demo_code'
              ]
            },
            'description': 'Required icon components for the component'
          },
          'optional_icon_components': {
            'type': 'array',
            'items': {
              'type': 'object',
              'properties': {
                'name': {
                  'type': 'string',
                  'description': 'Name of the icon component'
                },
                'description': {
                  'type': 'string',
                  'description': 'Description of the icon component'
                },
                'demo_code': {
                  'type': 'string',
                  'description': 'Demo code for the icon component'
                }
              },
              'required': [
                'name',
                'description',
                'demo_code'
              ]
            },
            'description': 'Optional icon components for the component'
          }
        },
        'required': ['component_name', 'component_description'],
      }
    },
  }
  private generate_json_system_message = `Your task is to generate a JSON schema for the user's request.\n` +
    `Please follow the format specified in the user's description.\n` +
    `You can ask clarifying questions if needed.`


  async generateJSONfromDescription(ctx: EngineVContext): Promise<EngineVContext> {
    const ai_response = ollama.chat({
      model: this.ollama_config.parsed.MODEL,
      messages: [
        {
          role: "system",
          content: this.generate_json_system_message,
        }
      ],
      tools: [this.generate_json_tool_call]
    });

    console.log(ai_response);

    return ctx;
  }
}