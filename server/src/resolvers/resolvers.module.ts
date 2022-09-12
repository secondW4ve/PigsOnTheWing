import { Module } from '@nestjs/common';
import { ServicesModule } from '@services/services.module';
import { CollectionResolver } from './collection/collection.resolver';
import { RequestDataResolver } from './request/request.resolver';
import { UserResolver } from './user/user.resolver';

@Module({
  imports: [ServicesModule],
  providers: [UserResolver, RequestDataResolver, CollectionResolver],
  exports: [UserResolver, RequestDataResolver, CollectionResolver],
})
export class ResolversModule {}
