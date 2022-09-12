import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { getEnvFilePaths } from '@helpers/get-env-file-paths';
import configuration from './database.config';
import { DatabaseConfigService } from './database-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: [...getEnvFilePaths()],
    }),
  ],
  providers: [ConfigService, DatabaseConfigService],
  exports: [ConfigService, DatabaseConfigService],
})
export class DatabaseConfigModule {}
