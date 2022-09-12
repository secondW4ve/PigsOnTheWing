import { Collection } from '@database/entities/collection.entity';
import { Header } from '@database/entities/header.entity';
import { RequestData } from '@database/entities/request-data.entity';
import { User } from '@database/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { CollectionService } from './collection.service';
import { HeaderService } from './header.service';
import { RequestDataService } from './request-data.service';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, RequestData, Collection, Header])],
  providers: [
    UserService,
    AuthService,
    RequestDataService,
    CollectionService,
    HeaderService,
  ],
  exports: [
    UserService,
    AuthService,
    RequestDataService,
    CollectionService,
    HeaderService,
  ],
})
export class ServicesModule {}
