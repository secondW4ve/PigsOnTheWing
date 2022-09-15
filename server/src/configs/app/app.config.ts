import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  authSecret: process.env.AUTH_SECRET,
  cookieName: process.env.COOKIE_NAME,
  cookieMaxAgeMinutes: process.env.COOKIE_MAX_AGE_MINUTES,
  secureCookie: process.env.SECURE_COOKIE,
  corsOrigin: process.env.CORS_ORIGIN,
}));
