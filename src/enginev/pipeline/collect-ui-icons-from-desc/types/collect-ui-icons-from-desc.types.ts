import { IconComponent, UIComponent } from '../../../types/elements.types';
import {
  type AbstractEngineVRequest,
  type AbstractEngineVResponse,
} from '../../../types/enginev.types';
import { EngineVError } from '../../../types/errors';

export interface CollectUiIconsRequest extends AbstractEngineVRequest {
  request_type: 'collect_ui_icons';
  component_description: string;
  // theme_colors?: string[];
}

export type CollectUiIconsResponse =
  | CollectUiIconsResponseSuccess
  | CollectUiIconsResponseError;

interface CollectUiIconsResponseSuccess extends AbstractEngineVResponse {
  response_type: 'collect_ui_icons';
  data: {
    icon_names: IconComponent[];
    reasons: string[];
  };
  status: 'success';
}

interface CollectUiIconsResponseError extends AbstractEngineVResponse {
  response_type: 'collect_ui_icons';
  error: EngineVError;
  status: 'error';
}
