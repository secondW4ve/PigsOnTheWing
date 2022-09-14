import { Header } from '@database/entities/header.entity';
import { RequestData } from '@database/entities/request-data.entity';
import { ErrorMessages } from '@enums/error-messages.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HeaderInput } from '@resolvers/header/header.gql-types';
import { Repository } from 'typeorm';

@Injectable()
export class HeaderService {
  public constructor(
    @InjectRepository(Header) private headerRepo: Repository<Header>,
  ) {}

  public async getByRequestId(requestId: string): Promise<Header[]> {
    const headers = await this.headerRepo.find({
      where: {
        request: {
          id: requestId,
        },
      },
    });

    return headers;
  }

  public async getById(id: string): Promise<Header> {
    const header = await this.headerRepo.findOneBy({ id });

    return header;
  }

  public async create(
    headerData: HeaderInput,
    request: RequestData,
  ): Promise<Header> {
    const header = new Header();
    header.name = headerData.name;
    header.value = headerData.value;
    header.request = request;

    return await this.headerRepo.save(header);
  }

  public async update(
    headerId: string,
    headerData: HeaderInput,
  ): Promise<Header> {
    const headerToUpdate = await this.getById(headerId);

    if (headerToUpdate === null) {
      throw new Error(ErrorMessages.HEADER_WITH_ID_DOES_NOT_EXIST);
    }

    const updatedHeader = {
      ...headerToUpdate,
      headerData,
    };

    return await this.headerRepo.save(updatedHeader);
  }

  public async removeRequestHeaders(request: RequestData): Promise<void> {
    await Promise.all(
      request.headers.map(async (header) => {
        await this.deleteById(header.id);
      }),
    );

    return;
  }

  public async deleteById(id: string): Promise<Header | null> {
    const header = await this.getById(id);

    if (header === null) {
      return null;
    }

    return await this.headerRepo.remove(header);
  }
}
