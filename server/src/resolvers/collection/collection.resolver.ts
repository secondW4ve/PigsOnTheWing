import { Collection } from '@database/entities/collection.entity';
import { RequestData } from '@database/entities/request-data.entity';
import { User } from '@database/entities/user.entity';
import { ErrorMessages } from '@enums/error-messages.enum';
import { GqlContext } from '@interfaces/gql.interfaces';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CollectionService } from '@services/collection.service';
import { RequestDataService } from '@services/request-data.service';
import { UserService } from '@services/user.service';
import { CollectionInput, CollectionResponse } from './collection.gql-types';

@Resolver(() => CollectionResponse)
export class CollectionResolver {
  public constructor(
    private collectionService: CollectionService,
    private userService: UserService,
    private requestDataService: RequestDataService,
  ) {}

  @Query(() => [Collection])
  async userCollections(@Context() { req }: GqlContext): Promise<Collection[]> {
    const user = await this.userService.getById(req.session.userId, true);

    return user.collections;
  }

  @Query(() => CollectionResponse)
  async collectionByName(
    @Args('collectionName') collectionName: string,
    @Context() { req }: GqlContext,
  ): Promise<CollectionResponse | null> {
    const user = await this.userService.getById(req.session.userId, true);

    const collections = user.collections.filter(
      (collection) => collection.name === collectionName,
    );

    if (collections.length > 0) {
      return {
        collection: collections[0],
      };
    }

    return null;
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

  @Mutation(() => CollectionResponse)
  async createCollection(
    @Args('collectionData') collectionData: CollectionInput,
    @Context() { req }: GqlContext,
  ): Promise<CollectionResponse> {
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
  ): Promise<CollectionResponse> {
    try {
      const collection = await this.collectionService.update(
        collectionId,
        collectionData,
      );

      return { collection };
    } catch (err) {
      if (err.message === ErrorMessages.COLLECTION_WITH_ID_DOES_NOT_EXIST) {
        return {
          errors: [
            {
              field: 'collectionId',
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
      );

      return { collection };
    } catch (err) {
      if (err.message === ErrorMessages.COLLECTION_WITH_ID_DOES_NOT_EXIST) {
        return {
          errors: [
            {
              field: 'collectionId',
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
      );

      return { collection };
    } catch (err) {
      if (err.message === ErrorMessages.COLLECTION_WITH_ID_DOES_NOT_EXIST) {
        return {
          errors: [
            {
              field: 'collectionId',
              message: err.message,
            },
          ],
        };
      }

      throw err;
    }
  }

  @Mutation(() => CollectionResponse, { nullable: true })
  async deleteCollection(
    @Args('collectionId') collectionId: string,
  ): Promise<CollectionResponse> {
    const deletedCollection = await this.collectionService.deleteById(
      collectionId,
    );

    return {
      collection: deletedCollection,
    };
  }
}
