import { IconComponent, UIComponent } from './elements.types';
import {
  type AbstractEngineVRequest,
  type AbstractEngineVResponse,
} from './enginev.types';

export interface GenerateJSONRequest extends AbstractEngineVRequest {
  request_type: 'generate_json';
  component_description: string;
  // theme_colors?: string[];
}

export interface GenerateJSONResponseSuccess extends AbstractEngineVResponse {
  response_type: 'generate_json';
  json: string;
  component_name: string;
  component_description: string;
  component_description_details: string;

  required_ui_components: UIComponent[];
  optional_ui_components: UIComponent[];

  required_icon_components: IconComponent[];
  optional_icon_components: IconComponent[];

  status: 'success';
}

export interface GenerateJSONResponseError extends AbstractEngineVResponse {
  response_type: 'generate_json';
  error: string;
  status_code: number;

  traceback?: string;
  reason?: string;

  status: 'error';
}
