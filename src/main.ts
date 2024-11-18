import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


    // Enable CORS for all origins (you can restrict it by providing specific origins if needed)
    app.enableCors({
      origin: '*', // Allow all origins (change this to a specific origin in production for better security)
      methods: 'GET,POST,PUT,PATCH,DELETE', // Specify allowed HTTP methods
      allowedHeaders: 'Content-Type, Authorization', // Specify allowed headers
    });

  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
