import { Collection } from '@database/entities/collection.entity';
import { RequestData } from '@database/entities/request-data.entity';
import { User } from '@database/entities/user.entity';
import { ErrorMessages } from '@enums/error-messages.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FieldError } from '@resolvers/common/common.gql-types';
import { HeaderInput } from '@resolvers/header/header.gql-types';
import { RequestDataInput } from '@resolvers/request/request.gql-types';
import { Repository } from 'typeorm';
import { HeaderService } from './header.service';

@Injectable()
export class RequestDataService {
  public constructor(
    @InjectRepository(RequestData)
    private requestDataRepo: Repository<RequestData>,
    private headerService: HeaderService,
  ) {}

  public async getByCollectionId(collectionId: string): Promise<RequestData[]> {
    const requestData = await this.requestDataRepo.findBy({
      collection: {
        id: collectionId,
      },
    });

    return requestData;
  }

  public async create(
    requestData: RequestDataInput,
    collection: Collection,
    requester: User,
  ): Promise<RequestData> {
    if (
      collection.users.findIndex(
        (collectionUser) => collectionUser.id === requester.id,
      ) === -1
    ) {
      throw new FieldError(
        'collectionId',
        ErrorMessages.COLLECTION_WITH_ID_DOES_NOT_EXIST,
      );
    }

    const request = new RequestData();
    request.name = requestData.name;
    request.description = requestData.description;
    request.method = requestData.method;
    request.url = requestData.url;
    request.body = requestData.body || null;
    request.collection = collection;
    const savedRequest = await this.requestDataRepo.save(request);

    await Promise.all(
      requestData.headers.map(async (headerData) => {
        return await this.headerService.create(headerData, savedRequest);
      }),
    );

    return request;
  }

  public async getById(
    id: string,
    loadRelations = false,
  ): Promise<RequestData | null> {
    let relations = {};
    if (loadRelations) {
      relations = {
        headers: true,
        collection: true,
      };
    }
    const requestData = await this.requestDataRepo.findOne({
      where: {
        id,
      },
      relations,
    });

    return requestData;
  }

  public async addHeadersToRequest(
    requestData: RequestData,
    headers: HeaderInput[],
  ): Promise<RequestData> {
    await Promise.all(
      headers.map(async (headerData) => {
        await this.headerService.create(headerData, requestData);
      }),
    );

    return requestData;
  }

  public async update(
    request: RequestData,
    updatedRequest: RequestDataInput,
  ): Promise<RequestData> {
    const updatedRequestData = {
      ...request,
      ...updatedRequest,
    };

    delete updatedRequestData.headers;
    return await this.requestDataRepo.save(updatedRequestData);
  }

  public async deleteById(requestId: string): Promise<RequestData | null> {
    const requestData = await this.getById(requestId);

    if (requestData === null) {
      return null;
    }

    return await this.requestDataRepo.remove(requestData);
  }
}
