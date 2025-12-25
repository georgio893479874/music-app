import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true })
  setupSwagger(app)
  app.useGlobalPipes(new ValidationPipe()); 

  await app.listen(4521);
}
bootstrap();
