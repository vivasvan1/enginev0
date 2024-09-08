import { ConsoleLogger } from '@nestjs/common';
import fs from 'fs';
import path from 'path';

enum LogLevel {
  info = 'info',
  debug = 'debug',
  log = 'log',
  warn = 'warn',
  error = 'error',
}

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
    level,
    message,
    context,
  }: {
    level: LogLevel;
    message: any;
    context?: string;
  }) {
    const prefix = context ? `[${context}] ` : '';
    const timestamp = new Date().toISOString();
    let logMessage = `${timestamp} ${prefix}${JSON.stringify(message, null, 2)}`;
    try {
      fs.appendFileSync(this.fullFilePath, logMessage + '\n');
    } catch (err) {
      super.error(`Failed to write log to file: ${err.message}`);
    }
  }

  // Extracts file and line number from the stack trace and converts to a relative path
  private getFileAndLineNumber(): string {
    const stack = new Error().stack;
    if (!stack) return '';

    const stackLines = stack.split('\n');
    const callerLine = stackLines[3]; // The third line should be the caller
    const match = callerLine.match(/\(([^)]+)\)/); // Extracts the file and line number

    if (match) {
      const fullPath = match[1]; // Full file path with line and column number
      const projectRoot = process.cwd(); // Get the current working directory (project root)

      // Remove the project root from the full path to get the relative path
      const relativePath = path.relative(projectRoot, fullPath);
      return relativePath;
    } else {
      return 'unknown source';
    }
  }

  private formatLogMessage(messages: any[]): string {
    return messages
      .map((msg) =>
        typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg,
      )
      .join(' ');
  }

  // General logging function that captures context automatically
  private logMessage(level: LogLevel, ...messages: any[]) {
    const context = this.getFileAndLineNumber();
    const formattedMessage = this.formatLogMessage(messages);
    this.appendLogToFile({ level, message: formattedMessage, context });
    super[level](formattedMessage, context);
  }

  info(...messages: any[]) {
    this.logMessage(LogLevel.info, undefined, ...messages);
  }

  debug(...messages: any[]) {
    this.logMessage(LogLevel.debug, undefined, ...messages);
  }

  log(...messages: any[]) {
    this.logMessage(LogLevel.log, undefined, ...messages);
  }

  warn(...messages: any[]) {
    this.logMessage(LogLevel.warn, undefined, ...messages);
  }

  error(...messages: any[]) {
    this.logMessage(LogLevel.error, undefined, ...messages);
  }
}
