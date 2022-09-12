import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  dialect: process.env.DATABASE_DIALECT,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  name: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER_NAME,
  password: process.env.DATABASE_USER_PASSWORD,
  ssl: process.env.DATABASE_SSL_CONNECTION,
  logging: process.env.DATABASE_ENABLE_LOGGING,
  migrationsRun: process.env.DATABASE_MIGRATIONS_RUN,
}));
