import { Collection } from '@database/entities/collection.entity';
import { RequestData } from '@database/entities/request-data.entity';
import { User } from '@database/entities/user.entity';
import { ErrorMessages } from '@enums/error-messages.enum';
import { GqlContext } from '@interfaces/gql.interfaces';
import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { FieldError } from '@resolvers/common/common.gql-types';
import { CollectionService } from '@services/collection.service';
import { RequestDataService } from '@services/request-data.service';
import { UserService } from '@services/user.service';
import { AuthGuard } from 'src/middleware/auth.middleware';
import {
  CollectionDeleteResponse,
  CollectionInput,
  CollectionResponse,
} from './collection.gql-types';

@Resolver(() => Collection)
@UseGuards(AuthGuard)
export class CollectionResolver {
  public constructor(
    private collectionService: CollectionService,
    private userService: UserService,
    private requestDataService: RequestDataService,
  ) {}

  @Query(() => [Collection])
  async userCollections(@Context() { req }: GqlContext): Promise<Collection[]> {
    const user = await this.userService.getById(req.session.userId, true);

    return [...user.collections];
  }

  @Query(() => CollectionResponse)
  async collectionById(
    @Args('collectionId') collectionId: string,
    @Context() { req }: GqlContext,
  ): Promise<CollectionResponse | null> {
    const user = await this.userService.getById(req.session.userId, true);

    const collections = user.collections.filter(
      (collection) => collection.id === collectionId,
    );

    if (collections.length > 0) {
      return {
        collection: collections[0],
      };
    }

    return {
      errors: [
        {
          field: 'collectionId',
          message: ErrorMessages.COLLECTION_WITH_ID_DOES_NOT_EXIST,
        },
      ],
    };
  }

  @Mutation(() => CollectionResponse)
  async createCollection(
    @Args('collectionData') collectionData: CollectionInput,
    @Context() { req }: GqlContext,
  ): Promise<CollectionResponse> {
    if (collectionData.name.length <= 2) {
      return {
        errors: [
          {
            field: 'name',
            message: ErrorMessages.NAME_TOO_SHORT,
          },
        ],
      };
    }

    const user = await this.userService.getById(req.session.userId);
    const collection = await this.collectionService.create(
      collectionData,
      user,
    );

    return {
      collection,
    };
  }

  @Mutation(() => CollectionResponse)
  async updateCollection(
    @Args('collectionId') collectionId: string,
    @Args('collectionData') collectionData: CollectionInput,
    @Context() { req }: GqlContext,
  ): Promise<CollectionResponse> {
    try {
      const collection = await this.collectionService.update(
        collectionId,
        collectionData,
        req.session.userId,
      );

      return { collection };
    } catch (err) {
      if (err instanceof FieldError) {
        return {
          errors: [
            {
              field: err.field,
              message: err.message,
            },
          ],
        };
      }

      throw err;
    }
  }

  @Mutation(() => CollectionResponse)
  async addUserToCollection(
    @Args('username') username: string,
    @Args('collectionId') collectionId: string,
    @Context() { req }: GqlContext,
  ): Promise<CollectionResponse> {
    const user = await this.userService.getByUsername(username);

    if (user === null) {
      return {
        errors: [
          {
            field: 'username',
            message: ErrorMessages.USER_WITH_THIS_USERNAME_DOES_NOT_EXIST,
          },
        ],
      };
    }

    try {
      const collection = await this.collectionService.addUserToCollection(
        collectionId,
        user,
        req.session.userId,
      );

      return { collection };
    } catch (err) {
      if (err instanceof FieldError) {
        return {
          errors: [
            {
              field: err.field,
              message: err.message,
            },
          ],
        };
      }

      throw err;
    }
  }

  @Mutation(() => CollectionResponse)
  async removeUserFromCollection(
    @Args('username') username: string,
    @Args('collectionId') collectionId: string,
    @Context() { req }: GqlContext,
  ): Promise<CollectionResponse> {
    const user = await this.userService.getByUsername(username);

    if (user === null) {
      return {
        errors: [
          {
            field: 'username',
            message: ErrorMessages.USER_WITH_THIS_USERNAME_DOES_NOT_EXIST,
          },
        ],
      };
    }

    try {
      const collection = await this.collectionService.removeUserFromCollection(
        collectionId,
        user,
        req.session.userId,
      );

      return { collection };
    } catch (err) {
      if (err instanceof FieldError) {
        return {
          errors: [
            {
              field: err.field,
              message: err.message,
            },
          ],
        };
      }

      throw err;
    }
  }

  @Mutation(() => CollectionDeleteResponse, { nullable: true })
  async deleteCollection(
    @Args('collectionId') collectionId: string,
    @Context() { req }: GqlContext,
  ): Promise<CollectionDeleteResponse> {
    const user = await this.userService.getById(req.session.userId);
    const collection = await this.collectionService.getById(collectionId);

    if (collection === null || collection.owner.id !== user.id) {
      return {
        errors: [
          {
            field: 'collectionId',
            message: ErrorMessages.COLLECTION_WITH_ID_DOES_NOT_EXIST,
          },
        ],
      };
    }

    await this.collectionService.deleteById(collection.id);

    return {
      deleted: true,
    };
  }

  @ResolveField(() => [User])
  async users(@Parent() collection: Collection): Promise<User[]> {
    const users = await this.userService.getForCollection(collection.id);

    return users;
  }

  @ResolveField(() => [RequestData])
  async requests(@Parent() collection: Collection): Promise<RequestData[]> {
    const requests = await this.requestDataService.getByCollectionId(
      collection.id,
    );
    return requests;
  }
}
