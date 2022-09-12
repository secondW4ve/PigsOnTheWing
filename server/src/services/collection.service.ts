import { Collection } from '@database/entities/collection.entity';
import { User } from '@database/entities/user.entity';
import { ErrorMessages } from '@enums/error-messages.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionInput } from '@resolvers/collection/collection.gql-types';
import { Repository } from 'typeorm';

@Injectable()
export class CollectionService {
  public constructor(
    @InjectRepository(Collection)
    private collectionRepo: Repository<Collection>,
  ) {}

  public async getById(id: string): Promise<Collection | null> {
    const collection = await this.collectionRepo.findOne({
      where: {
        id,
      },
    });

    return collection;
  }

  public async getAll(): Promise<Collection[]> {
    const collections = await this.collectionRepo.find();

    return collections;
  }

  public async getByUserAndName(
    collectionName: string,
    user: User,
  ): Promise<Collection | null> {
    return await this.collectionRepo.findOne({
      where: {
        name: collectionName,
        users: {
          id: user.id,
        },
      },
    });
  }

  public async create(
    collectionData: CollectionInput,
    user: User,
  ): Promise<Collection> {
    const collection = new Collection();
    collection.name = collectionData.name;
    collection.description = collectionData.description;
    collection.requests = null;
    collection.users = [user];

    return await this.collectionRepo.save(collection);
  }

  public async update(
    collectionId: string,
    collectionData: CollectionInput,
  ): Promise<Collection | null> {
    const collectionToUpdate = await this.getById(collectionId);

    if (collectionToUpdate === null) {
      throw new Error(ErrorMessages.COLLECTION_WITH_ID_DOES_NOT_EXIST);
    }

    const updatedCollection = {
      ...collectionToUpdate,
      ...collectionData,
    };

    return await this.collectionRepo.save(updatedCollection);
  }

  public async getByRequestId(requestId: string): Promise<Collection | null> {
    const collection = await this.collectionRepo.findOne({
      where: {
        requests: {
          id: requestId,
        },
      },
    });

    return collection;
  }

  public async deleteById(id: string): Promise<Collection | null> {
    const collection = await this.getById(id);

    if (collection === null) {
      return null;
    }

    return await this.collectionRepo.remove(collection);
  }

  public async addUserToCollection(
    id: string,
    user: User,
  ): Promise<Collection> {
    const collection = await this.getById(id);
    if (collection === null) {
      throw new Error(ErrorMessages.COLLECTION_WITH_ID_DOES_NOT_EXIST);
    }

    collection.users.push(user);

    return await this.collectionRepo.save(collection);
  }

  public async removeUserFromCollection(
    id: string,
    user: User,
  ): Promise<Collection> {
    const collection = await this.getById(id);
    if (collection === null) {
      throw new Error(ErrorMessages.COLLECTION_WITH_ID_DOES_NOT_EXIST);
    }

    const indexOfUser = collection.users.indexOf(user);
    collection.users.splice(indexOfUser, 1);

    return await this.collectionRepo.save(collection);
  }
}
