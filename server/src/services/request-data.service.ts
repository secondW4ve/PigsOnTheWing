import { Header } from '@database/entities/header.entity';
import { RequestData } from '@database/entities/request-data.entity';
import { ErrorMessages } from '@enums/error-messages.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HeaderInput } from '@resolvers/header/header.gql-types';
import { RequestDataInput } from '@resolvers/request/request.gql-types';
import { Repository } from 'typeorm';
import { CollectionService } from './collection.service';

@Injectable()
export class RequestDataService {
  public constructor(
    @InjectRepository(RequestData)
    private requestDataRepo: Repository<RequestData>,
    private collectionService: CollectionService,
  ) {}

  public async getByCollectionId(collectionId: string): Promise<RequestData[]> {
    const requestData = await this.requestDataRepo.findBy({
      collection: {
        id: collectionId,
      },
    });

    return requestData;
  }

  public async create(requestData: RequestDataInput): Promise<RequestData> {
    const collection = await this.collectionService.getById(
      requestData.collectionId,
    );
    const requestWithSameName = collection.requests.find(
      (request) => request.name === requestData.name,
    );
    if (requestWithSameName) {
      throw new Error(ErrorMessages.REQUEST_WITH_NAME_ALREADY_EXIST);
    }

    const request = new RequestData();
    request.name = requestData.name;
    request.description = requestData.description;
    request.method = requestData.method;
    request.body = requestData.body || null;
    const headers = requestData.headers.map((headerData) => {
      const header = new Header();
      header.name = headerData.name;
      header.value = headerData.value;
      return header;
    });
    request.headers = headers;
    request.collection = collection;

    return await this.requestDataRepo.save(request);
  }

  public async getById(id: string): Promise<RequestData | null> {
    const requestData = await this.requestDataRepo.findOne({
      where: {
        id,
      },
    });

    return requestData;
  }

  public async updateHeaders(
    requestData: RequestData,
    headers: HeaderInput[],
  ): Promise<RequestData> {
    headers.forEach((headerData) => {
      const header = new Header();
      header.name = headerData.name;
      header.value = headerData.value;
      requestData.headers.push(header);
    });

    return await this.requestDataRepo.save(requestData);
  }

  public async update(
    requestId: string,
    requestData: RequestDataInput,
  ): Promise<RequestData> {
    const requestDataToUpdate = await this.getById(requestId);
    if (requestDataToUpdate === null) {
      throw new Error(ErrorMessages.REQUEST_WITH_ID_DOES_NOT_EXIST);
    }

    const updatedRequestData = {
      ...requestDataToUpdate,
      ...requestData,
    };

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
