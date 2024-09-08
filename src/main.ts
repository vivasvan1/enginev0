import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import path from 'path';
import fs from 'fs';
import { MyLogger } from './logger';

async function bootstrap() {
  // Nest Setup
  const app = await NestFactory.create(AppModule, {
    logger: new MyLogger('EngineV'),
  });

  // Configure logging
  const logDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  // Swagger Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('EngineV API')
    .setDescription('EngineV is an AI-powered component generator for react')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);

  // Start the server
  await app.listen(8080);
}
bootstrap();
