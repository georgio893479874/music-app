import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createClient } from 'redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  await app.listen(4521);
}
bootstrap();
async function connectRedis() {
  const redisClient = createClient({
    url: process.env.REDIS_URL,
  });
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  await redisClient.connect();
}

connectRedis();





