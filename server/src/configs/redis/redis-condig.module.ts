import { getEnvFilePaths } from '@helpers/get-env-file-paths';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisConfigService } from './redis-config.service';
import configuration from './redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: [...getEnvFilePaths()],
    }),
  ],
  providers: [ConfigService, RedisConfigService],
  exports: [ConfigService, RedisConfigService],
})
export class RedisConfigModule {}
