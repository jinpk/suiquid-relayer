import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Sui Bh Seoul hide and seek')
    .setDescription(
      'this api build for demo:)' +
        '<br/>you can participate in only one game!',
    )
    .setVersion('1.0')
    .addTag('Player')
    .addTag('Game')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
