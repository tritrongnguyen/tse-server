import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { PORT } = process.env;
  app.setGlobalPrefix('/api/v1')
  const config = new DocumentBuilder()
    .setTitle("TSE API")
    .setDescription("TSE API Documentation")
    .setVersion('1.0')
    .addTag("TSE API")
    .build();

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document);
  await app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
  })
}
bootstrap();