import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('PoApper Hackathon Backend')
    .setVersion('0.0')
    .build();
  const apiDocs = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, apiDocs);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
