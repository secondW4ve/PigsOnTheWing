import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('redis.redisHost');
  }

  get port(): number {
    return +this.configService.get<string>('redis.redisPort');
  }

  get password(): string {
    return this.configService.get<string>('redis.redisPassword');
  }
}
