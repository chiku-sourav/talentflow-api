import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { RequestMethod, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(app.get(LoggingInterceptor));
  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'register', method: RequestMethod.POST },
      { path: 'login', method: RequestMethod.POST },
      { path: 'health', method: RequestMethod.GET },
      { path: 'webhook', method: RequestMethod.POST },
    ],
  });
  app.enableVersioning({ type: VersioningType.URI });
  await app.listen(3000);
}

bootstrap();
