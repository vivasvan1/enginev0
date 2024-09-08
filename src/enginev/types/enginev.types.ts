// File: enginev.types.ts
// Author: Vivasvan Patel
// Author Email: vivasvanpatel40@gmail.com
// License: MIT

import {
  GenerateComponentCodeRequest,
  GenerateComponentCodeResponse,
} from './generatecomponent.types';
import {
  GenerateDesignJsonFromDescriptionRequest,
  GenerateDesignJsonFromDescriptionResponse,
} from '../pipeline/3-generate-design-json-from-desc/types/generate-design-json-from-desc.types';
import {
  GenerateCodeFromDesignJsonRequest,
  GenerateCodeFromDesignJsonResponse,
} from '../pipeline/4-generare-code-from-design-json/types/generate-code-from-design-json.types';

// Generic interface for request-response pairing
export interface EngineVRequestResponsePair<
  Req extends EngineVRequest,
  Res extends EngineVResponse,
> {
  request: Req;
  response: Res;
}

// Base interface for requests
export interface AbstractEngineVRequest {
  request_type: string;
}

// Base interface for responses
export interface AbstractEngineVResponse {
  response_type: string;
  status: 'success' | 'error';
}

// Union type for all possible requests
export type EngineVRequest =
  | GenerateDesignJsonFromDescriptionRequest
  | GenerateComponentCodeRequest
  | GenerateCodeFromDesignJsonRequest;

// Union type for all possible responses (success or error)
export type EngineVResponse =
  | GenerateDesignJsonFromDescriptionResponse
  | GenerateComponentCodeResponse
  | GenerateCodeFromDesignJsonResponse;

// Create specific types for each request/response pair
export type EngineVRequestResponsePairForGenerateJSON =
  EngineVRequestResponsePair<
    GenerateDesignJsonFromDescriptionRequest,
    GenerateDesignJsonFromDescriptionResponse
  >;

export type EngineVRequestResponsePairForGenerateComponentCode =
  EngineVRequestResponsePair<
    GenerateComponentCodeRequest,
    GenerateComponentCodeResponse
  >;

export type EngineVRequestResponsePairForGenerateCodeFromDesignJson =
  EngineVRequestResponsePair<
    GenerateCodeFromDesignJsonRequest,
    GenerateCodeFromDesignJsonResponse
  >;

export type EngineVStartRequest = {
  request_type: 'start';
  component_description: string;
  // theme_colors?: string[];
};

// Combine them into a union for the context
export type EngineVRequestResponsePairUnion =
  | EngineVStartRequest
  | EngineVRequestResponsePairForGenerateJSON
  | EngineVRequestResponsePairForGenerateComponentCode
  | EngineVRequestResponsePairForGenerateCodeFromDesignJson;

// EngineVContext that ensures request-response pairing is enforced
export interface EngineVContext {
  requestResponses: EngineVRequestResponsePairUnion[];
}
