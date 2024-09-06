// GENERATE COMPONENT CODE REQUEST START

import {
  AbstractEngineVRequest,
  AbstractEngineVResponse,
} from './enginev.types';

// Request and Response types for "generate_component_code" case
export interface GenerateComponentCodeRequest extends AbstractEngineVRequest {
  request_type: 'generate_component_code';
  component_name: string;
  language: 'typescript' | 'javascript' | 'python'; // Example languages
  framework: string;
}

export interface GenerateComponentCodeResponseSuccess
  extends AbstractEngineVResponse {
  response_type: 'generate_component_code';
  code: string;
  component_name: string;
  status: 'success';
}

export interface GenerateComponentCodeResponseError
  extends AbstractEngineVResponse {
  response_type: 'generate_component_code';
  error: string;
  status_code: number;
  status: 'error';
}

// GENERATE COMPONENT CODE REQUEST END
