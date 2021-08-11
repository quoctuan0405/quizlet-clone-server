import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors({ origin: process.env.FRONTEND_SERVER_URL as string, credentials: true}));
  app.use(cookieParser());

  await app.listen(4000);
}
bootstrap();
