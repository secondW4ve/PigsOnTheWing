import { AppConfigModule } from '@configs/app/app-config.module';
import { AppConfigService } from '@configs/app/app-config.service';
import { Module } from '@nestjs/common';
import { ServicesModule } from '@services/services.module';
import { CollectionResolver } from './collection/collection.resolver';
import { RequestDataResolver } from './request/request.resolver';
import { UserResolver } from './user/user.resolver';

@Module({
  imports: [ServicesModule, AppConfigModule],
  providers: [
    UserResolver,
    RequestDataResolver,
    CollectionResolver,
    AppConfigService,
  ],
  exports: [UserResolver, RequestDataResolver, CollectionResolver],
})
export class ResolversModule {}
