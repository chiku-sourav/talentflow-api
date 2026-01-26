import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Logger } from 'nestjs-pino';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });

    app.useLogger(app.get(Logger));
    app.useGlobalInterceptors(app.get(LoggingInterceptor));
    await app.listen(3000);
}

bootstrap();