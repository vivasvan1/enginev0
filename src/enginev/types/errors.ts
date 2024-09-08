export interface EngineVErrorType extends Error {
  status_code?: number;
  traceback?: string;
  reason?: string;
}

export class EngineVError extends Error implements EngineVErrorType {
  name: string;
  message: string;
  stack?: string;
  status_code?: number;
  traceback?: string;
  reason?: string;

  constructor(
    name: string = 'EngineVError',
    message: string,
    stack?: string,
    status_code?: number,
    traceback?: string,
    reason?: string,
  ) {
    super(message);
    this.name = name;
    this.message = message;
    this.stack = stack;
    this.status_code = status_code;
    this.traceback = traceback;
    this.reason = reason;
  }
}
