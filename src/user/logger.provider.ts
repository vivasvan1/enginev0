import { Injectable } from '@nestjs/common';

@Injectable()
export class Logger {
  private readonly messages: string[] = [];

  log(message: string) {
    this.messages.push(message);
    this.printAllMessages();
  }

  printAllMessages(): void {
    console.log(this.messages);
  }
}
