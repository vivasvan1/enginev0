import {
  type AbstractEngineVRequest,
  type AbstractEngineVResponse,
} from '../../../types/enginev.types';
import { EngineVError } from '../../../types/errors';
import { GenerateDesignJsonFromDescriptionResponseSuccess } from '../../3-generate-design-json-from-desc/types/generate-design-json-from-desc.types';

export interface GenerateCodeFromDesignJsonRequest
  extends AbstractEngineVRequest {
  request_type: 'generate_code_from_design_json';
  design_json: GenerateDesignJsonFromDescriptionResponseSuccess['data'];
}

export type GenerateCodeFromDesignJsonResponse =
  | GenerateCodeFromDesignJsonResponseSuccess
  | GenerateCodeFromDesignJsonResponseError;

interface GenerateCodeFromDesignJsonResponseSuccess
  extends AbstractEngineVResponse {
  response_type: 'generate_code_from_design_json';
  data: {
    code: string;
  };
  status: 'success';
}

interface GenerateCodeFromDesignJsonResponseError
  extends AbstractEngineVResponse {
  response_type: 'generate_code_from_design_json';
  error: EngineVError;
  status: 'error';
}
