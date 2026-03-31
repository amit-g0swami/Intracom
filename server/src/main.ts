import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './adapters/redis-io.adapter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS since the Web Widget runs on random client domains
  app.enableCors();

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
