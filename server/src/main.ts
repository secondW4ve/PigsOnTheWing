import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import connectRedis from 'connect-redis';
import session from 'express-session';
import * as redis from 'redis';
import { RedisConfigService } from '@configs/redis/redis-config.service';
import { AppConfigService } from '@configs/app/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisConfigService = app.get<RedisConfigService>(RedisConfigService);
  const appConfigService = app.get<AppConfigService>(AppConfigService);

  const RedisStore = connectRedis(session);
  const redisClient: any = redis.createClient({
    url: `redis://${redisConfigService.host}:${redisConfigService.port}`,
    password: redisConfigService.password,
    legacyMode: true,
  });

  await redisClient.connect();

  app.use(
    session({
      name: appConfigService.cookieName,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
        disableTTL: true,
      }),
      cookie: {
        maxAge: appConfigService.cookieMaxAgeMinutes * 60 * 1000,
        httpOnly: true,
        secure: appConfigService.cookieSecure,
        sameSite: 'lax',
      },
      secret: appConfigService.authSecret,
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.listen(8080);
}
bootstrap();
