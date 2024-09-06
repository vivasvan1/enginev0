// File: enginev.types.ts
// Author: Vivasvan Patel
// Author Email: vivasvanpatel40@gmail.com
// License: MIT

import {
  GenerateComponentCodeRequest,
  GenerateComponentCodeResponseError,
  GenerateComponentCodeResponseSuccess,
} from './generatecomponent.types';
import {
  GenerateJSONRequest,
  GenerateJSONResponseError,
  GenerateJSONResponseSuccess,
} from './generatejson.types';

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
export type EngineVRequest = GenerateJSONRequest | GenerateComponentCodeRequest;

// Union type for all possible responses (success or error)
export type EngineVResponse =
  | GenerateJSONResponseSuccess
  | GenerateJSONResponseError
  | GenerateComponentCodeResponseSuccess
  | GenerateComponentCodeResponseError;

// Create specific types for each request/response pair
export type EngineVRequestResponsePairForGenerateJSON =
  EngineVRequestResponsePair<
    GenerateJSONRequest,
    GenerateJSONResponseSuccess | GenerateJSONResponseError
  >;

export type EngineVRequestResponsePairForGenerateComponentCode =
  EngineVRequestResponsePair<
    GenerateComponentCodeRequest,
    GenerateComponentCodeResponseSuccess | GenerateComponentCodeResponseError
  >;

// Combine them into a union for the context
export type EngineVRequestResponsePairUnion =
  | EngineVRequestResponsePairForGenerateJSON
  | EngineVRequestResponsePairForGenerateComponentCode;

// EngineVContext that ensures request-response pairing is enforced
export interface EngineVContext {
  requestResponses: EngineVRequestResponsePairUnion[];
  state: 'generate_json';
}
