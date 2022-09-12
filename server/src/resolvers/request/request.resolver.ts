import { Collection } from '@database/entities/collection.entity';
import { Header } from '@database/entities/header.entity';
import { RequestData } from '@database/entities/request-data.entity';
import { ErrorMessages } from '@enums/error-messages.enum';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { HeaderInput } from '@resolvers/header/header.gql-types';
import { CollectionService } from '@services/collection.service';
import { HeaderService } from '@services/header.service';
import { RequestDataService } from '@services/request-data.service';
import { RequestDataInput, RequestDataResponse } from './request.gql-types';

@Resolver(() => RequestData)
export class RequestDataResolver {
  public constructor(
    private requestDataService: RequestDataService,
    private collectionService: CollectionService,
    private headerService: HeaderService,
  ) {}

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

  @Mutation(() => RequestData)
  async createRequestInCollection(
    @Args('requestData') requestDataInput: RequestDataInput,
  ): Promise<RequestData> {
    const requestData = await this.requestDataService.create(requestDataInput);

    return requestData;
  }

  @Mutation(() => RequestDataResponse)
  async updateHeaders(
    @Args('headers', { type: () => [HeaderInput] }) headers: HeaderInput[],
    @Args('requestId') requestId: string,
  ): Promise<RequestDataResponse> {
    const requestData = await this.requestDataService.getById(requestId);
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

    const updatedRequest = await this.requestDataService.updateHeaders(
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
      const updatedRequestData = await this.requestDataService.update(
        requestId,
        requestData,
      );

      return {
        request: updatedRequestData,
      };
    } catch (err) {
      if (err.message === ErrorMessages.REQUEST_WITH_ID_DOES_NOT_EXIST) {
        return {
          errors: [
            {
              field: 'requestId',
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
}
