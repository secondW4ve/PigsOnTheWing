import { DatabaseConfigModule } from '@configs/database/database-config.module';
import { DatabaseConfigService } from '@configs/database/database-config.service';
import { Collection } from '@database/entities/collection.entity';
import { Header } from '@database/entities/header.entity';
import { RequestData } from '@database/entities/request-data.entity';
import { User } from '@database/entities/user.entity';
import { CreateTables1662480020362 } from '@database/migrations/1662480020362-CreateTables';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResolversModule } from '@resolvers/resolvers.module';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalModule } from './global.module';
import { GqlContext } from '@interfaces/gql.interfaces';

@Module({
  imports: [
    GlobalModule,
    ResolversModule,
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useFactory: (databaseConfigService: DatabaseConfigService) => {
        return {
          name: 'default',
          host: databaseConfigService.host,
          type: 'postgres',
          port: databaseConfigService.port,
          database: databaseConfigService.name,
          logging: databaseConfigService.logging,
          username: databaseConfigService.user,
          password: databaseConfigService.password,
          ...(databaseConfigService.ssl && {
            ssl: {
              rejectUnauthorized: false,
            },
          }),
          entities: [Collection, Header, RequestData, User],
          migrations: [CreateTables1662480020362],
          migrationsRun: databaseConfigService.migrationsRun,
          synchronize: false,
        };
      },
      inject: [DatabaseConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      context: ({ req, res }): GqlContext => ({ req, res }),
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
