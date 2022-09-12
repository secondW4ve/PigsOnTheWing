import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  redisHost: process.env.REDIS_HOST,
  redisPassword: process.env.REDIS_PASSWORD,
  redisPort: process.env.REDIS_PORT,
}));
