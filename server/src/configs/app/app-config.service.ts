import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get authSecret(): string {
    return this.configService.get<string>('app.authSecret');
  }

  get cookieName(): string {
    return this.configService.get<string>('app.cookieName');
  }

  get cookieMaxAgeMinutes(): number {
    return +this.configService.get<string>('app.cookieMaxAgeMinutes');
  }

  get cookieSecure(): boolean {
    return this.configService.get<string>('app.secureCookie') === 'true';
  }

  get corsOrigin(): string {
    return this.configService.get<string>('app.corsOrigin');
  }
}
