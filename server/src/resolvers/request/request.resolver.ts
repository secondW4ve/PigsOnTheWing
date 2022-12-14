import { Collection } from '@database/entities/collection.entity';
import { Header } from '@database/entities/header.entity';
import { RequestData } from '@database/entities/request-data.entity';
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
import { HeaderInput } from '@resolvers/header/header.gql-types';
import { CollectionService } from '@services/collection.service';
import { HeaderService } from '@services/header.service';
import { RequestDataService } from '@services/request-data.service';
import { UserService } from '@services/user.service';
import { AuthGuard } from 'src/middleware/auth.middleware';
import { RequestDataInput, RequestDataResponse } from './request.gql-types';

@Resolver(() => RequestData)
@UseGuards(AuthGuard)
export class RequestDataResolver {
  public constructor(
    private requestDataService: RequestDataService,
    private collectionService: CollectionService,
    private userService: UserService,
    private headerService: HeaderService,
  ) {}

  @Query(() => RequestDataResponse)
  async requestById(
    @Args('requestId') requestId: string,
  ): Promise<RequestDataResponse> {
    const request = await this.requestDataService.getById(requestId);

    if (request === null) {
      return {
        errors: [
          {
            field: 'requestId',
            message: ErrorMessages.REQUEST_WITH_ID_DOES_NOT_EXIST,
          },
        ],
      };
    }

    return {
      request,
    };
  }

  @Mutation(() => RequestDataResponse)
  async createRequestInCollection(
    @Args('collectionId') collectionId: string,
    @Args('requestData') requestDataInput: RequestDataInput,
    @Context() { req }: GqlContext,
  ): Promise<RequestDataResponse> {
    const collection = await this.collectionService.getById(collectionId, true);
    if (collection === null) {
      return {
        errors: [
          {
            field: 'collectionId',
            message: ErrorMessages.COLLECTION_WITH_ID_DOES_NOT_EXIST,
          },
        ],
      };
    }
    const user = await this.userService.getById(req.session.userId);

    try {
      const request = await this.requestDataService.create(
        requestDataInput,
        collection,
        user,
      );
      return { request };
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
    }
  }

  @Mutation(() => RequestDataResponse)
  async updateHeaders(
    @Args('headers', { type: () => [HeaderInput] }) headers: HeaderInput[],
    @Args('requestId') requestId: string,
  ): Promise<RequestDataResponse> {
    const requestData = await this.requestDataService.getById(requestId, true);
    if (requestData === null) {
      return {
        errors: [
          {
            field: 'requestId',
            message: ErrorMessages.REQUEST_WITH_ID_DOES_NOT_EXIST,
          },
        ],
      };
    }

    const updatedRequest = await this.requestDataService.addHeadersToRequest(
      requestData,
      headers,
    );

    return {
      request: updatedRequest,
    };
  }

  @Mutation(() => RequestDataResponse)
  async updateRequest(
    @Args('requestId') requestId: string,
    @Args('requestData') requestData: RequestDataInput,
  ): Promise<RequestDataResponse> {
    try {
      const request = await this.requestDataService.getById(requestId, true);
      if (!request) {
        throw new FieldError(
          'requestId',
          ErrorMessages.REQUEST_WITH_ID_DOES_NOT_EXIST,
        );
      }
      await this.headerService.removeRequestHeaders(request);
      await this.requestDataService.addHeadersToRequest(
        request,
        requestData.headers,
      );
      const updatedRequestData = await this.requestDataService.update(
        request,
        requestData,
      );

      return {
        request: updatedRequestData,
      };
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

  @Mutation(() => RequestDataResponse)
  async deleteRequest(
    @Args('requestId') requestId: string,
  ): Promise<RequestDataResponse> {
    const deletedRequest = await this.requestDataService.deleteById(requestId);

    return {
      request: deletedRequest,
    };
  }

  @ResolveField(() => Collection)
  async collection(@Parent() { id }: RequestData): Promise<Collection | null> {
    const collection = await this.collectionService.getByRequestId(id);

    return collection;
  }

  @ResolveField(() => [Header])
  async headers(@Parent() { id }: RequestData): Promise<Header[]> {
    const headers = await this.headerService.getByRequestId(id);

    return headers;
  }
}
