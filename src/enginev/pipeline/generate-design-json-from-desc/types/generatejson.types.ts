import { IconComponent, UIComponent } from '../../../types/elements.types';
import {
  EngineVContext,
  type AbstractEngineVRequest,
  type AbstractEngineVResponse,
} from '../../../types/enginev.types';
import { EngineVError } from '../../../types/errors';

export interface GenerateJSONRequest extends AbstractEngineVRequest {
  request_type: 'generate_json';
  component_description: string;
  collected_ui_components?: UIComponent[];
  collected_ui_components_reasons?: string[];
  collected_ui_icons?: IconComponent[];
  collected_ui_icons_reasons?: string[];
}

export type GenerateJSONResponse =
  | GenerateJSONResponseSuccess
  | GenerateJSONResponseError;

interface GenerateJSONResponseSuccess extends AbstractEngineVResponse {
  response_type: 'generate_json';
  data: {
    component_name: string;
    component_description: string;

    required_ui_components: UIComponent[];
    optional_ui_components?: UIComponent[];
    reasons_ui_components: string[];

    required_ui_icons: IconComponent[];
    optional_ui_icons?: IconComponent[];
    reasons_ui_icons: string[];
  };
  status: 'success';
}

interface GenerateJSONResponseError extends AbstractEngineVResponse {
  response_type: 'generate_json';
  error: EngineVError;
  status: 'error';
}
