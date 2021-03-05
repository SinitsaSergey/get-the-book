import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(PORT, HOST);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
