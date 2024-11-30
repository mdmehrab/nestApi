import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins (you can restrict it by providing specific origins if needed)
  app.enableCors({
    origin: 'http://localhost:5173', // The frontend origin
    credentials: true, // Allow cookies and other credentials
  });

  // Use cookie parser middleware
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
