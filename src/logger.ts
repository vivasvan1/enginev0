import { ConsoleLogger } from '@nestjs/common';
import fs from 'fs';
import path from 'path';

export class MyLogger extends ConsoleLogger {
  private fullFilePath: string;

  constructor(
    context: string = 'Application',
    private filePath: string = 'logs.txt',
  ) {
    super(context);
    this.fullFilePath = path.resolve(filePath);
  }

  // Resets the log file safely
  resetContext(): void {
    try {
      fs.writeFileSync(this.fullFilePath, '');
    } catch (err) {
      super.error(`Failed to reset log file: ${err.message}`);
    }
  }

  // Appends log to file with error handling
  private appendLogToFile({
    message,
    stack,
    context,
  }: {
    message: any;
    stack?: string;
    context?: string;
  }) {
    const prefix = context ? `[${context}] ` : '';
    const timestamp = new Date().toISOString();
    let logMessage = `${timestamp} ${prefix}${JSON.stringify(message, null, 2)}`;

    if (stack) {
      logMessage = `${timestamp} [ERROR] ${stack}\n${logMessage}`;
    }

    try {
      fs.appendFileSync(this.fullFilePath, logMessage + '\n');
    } catch (err) {
      super.error(`Failed to write log to file: ${err.message}`);
    }
  }

  // Extracts file and line number from the stack trace
  private getFileAndLineNumber(): string {
    const stack = new Error().stack;
    if (!stack) return '';
    
    const stackLines = stack.split('\n');
    const callerLine = stackLines[3]; // The third line should be the caller
    const match = callerLine.match(/\(([^)]+)\)/); // Extracts the file and line number
    return match ? match[1] : 'unknown source';
  }

  private formatLogMessage(messages: any[]): string {
    return messages.map(msg => (typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg)).join(' ');
  }

  // General logging function that captures context automatically
  private logMessage(level: string, stack?: string, ...messages: any[]) {
    const context = this.getFileAndLineNumber();
    const formattedMessage = this.formatLogMessage(messages);
    this.appendLogToFile({ message: formattedMessage, stack, context });
    super[level](formattedMessage, context);
  }

  log(...messages: any[]) {
    this.logMessage('log', undefined, ...messages);
  }

  warn(...messages: any[]) {
    this.logMessage('warn', undefined, ...messages);
  }

  debug(...messages: any[]) {
    this.logMessage('debug', undefined, ...messages);
  }

  error(stack?: string, ...messages: any[]) {
    this.logMessage('error', stack, ...messages);
  }
}