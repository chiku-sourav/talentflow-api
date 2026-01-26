import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppLoggerModule } from './common/logger/logger.module';
import { DevelopersModule } from './modules/developers/developers.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { MatchingModule } from './modules/matching/matching.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    AppLoggerModule,
    DevelopersModule,
    ConfigModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    ProjectsModule,
    ContractsModule,
    MatchingModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
