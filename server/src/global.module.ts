import { AppConfigModule } from '@configs/app/app-config.module';
import { AppConfigService } from '@configs/app/app-config.service';
import { DatabaseConfigModule } from '@configs/database/database-config.module';
import { DatabaseConfigService } from '@configs/database/database-config.service';
import { RedisConfigModule } from '@configs/redis/redis-condig.module';
import { RedisConfigService } from '@configs/redis/redis-config.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [DatabaseConfigModule, AppConfigModule, RedisConfigModule],
  providers: [DatabaseConfigService, AppConfigService, RedisConfigService],
  exports: [DatabaseConfigService, AppConfigService, RedisConfigService],
})
export class GlobalModule {}
