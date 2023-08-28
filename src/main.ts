import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('EAA')
    .setDescription('The EAA APIs')
    .setVersion('1.0')
    .addTag('EAA')
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
    })
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(process.env.APP_PORT);
}
bootstrap();
