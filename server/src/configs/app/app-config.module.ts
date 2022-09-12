import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { getEnvFilePaths } from '@helpers/get-env-file-paths';
import { AppConfigService } from './app-config.service';
import configuration from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: [...getEnvFilePaths()],
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
