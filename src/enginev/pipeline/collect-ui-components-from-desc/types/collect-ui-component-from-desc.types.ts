import { IconComponent, UIComponent } from '../../../types/elements.types';
import {
  type AbstractEngineVRequest,
  type AbstractEngineVResponse,
} from '../../../types/enginev.types';
import { EngineVError } from '../../../types/errors';

export interface CollectUiComponentRequest extends AbstractEngineVRequest {
  request_type: 'collect_ui_components';
  component_description: string;
  // theme_colors?: string[];
}

export type CollectUiComponentResponse =
  | CollectUiComponentResponseSuccess
  | CollectUiComponentResponseError;

interface CollectUiComponentResponseSuccess extends AbstractEngineVResponse {
  response_type: 'collect_ui_components';
  data: {
    ui_components: UIComponent[];
    reasons: string[];
  };
  status: 'success';
}

interface CollectUiComponentResponseError extends AbstractEngineVResponse {
  response_type: 'collect_ui_components';
  error: EngineVError;
  status: 'error';
}
