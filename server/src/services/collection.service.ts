import { Collection } from '@database/entities/collection.entity';
import { User } from '@database/entities/user.entity';
import { ErrorMessages } from '@enums/error-messages.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionInput } from '@resolvers/collection/collection.gql-types';
import { FieldError } from '@resolvers/common/common.gql-types';
import { Repository } from 'typeorm';

@Injectable()
export class CollectionService {
  public constructor(
    @InjectRepository(Collection)
    private collectionRepo: Repository<Collection>,
  ) {}

  public async getById(
    id: string,
    loadRelations = false,
  ): Promise<Collection | null> {
    let relations = {};
    if (loadRelations) {
      relations = {
        users: true,
        requests: true,
        owner: true,
      };
    }

    const collection = await this.collectionRepo.findOne({
      where: {
        id,
      },
      relations,
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
    collection.owner = user;

    return await this.collectionRepo.save(collection);
  }

  public async update(
    collectionId: string,
    collectionData: CollectionInput,
    requesterId: string,
  ): Promise<Collection | null> {
    const collectionToUpdate = await this.getById(collectionId);

    if (collectionToUpdate === null) {
      throw new FieldError(
        'collectionId',
        ErrorMessages.COLLECTION_WITH_ID_DOES_NOT_EXIST,
      );
    }

    if (collectionToUpdate.owner.id !== requesterId) {
      throw new FieldError(
        'collectionId',
        ErrorMessages.YOU_CANNOT_MODIFY_COLLECTION,
      );
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
    requesterId: string,
  ): Promise<Collection> {
    const collection = await this.getById(id, true);
    if (collection === null) {
      throw new FieldError(
        'collectionId',
        ErrorMessages.COLLECTION_WITH_ID_DOES_NOT_EXIST,
      );
    }

    if (collection.owner.id !== requesterId) {
      throw new FieldError(
        'collectionId',
        ErrorMessages.YOU_CANNOT_MODIFY_COLLECTION,
      );
    }

    if (
      collection.users.findIndex(
        (collectionUser) => collectionUser.id === user.id,
      ) !== -1
    ) {
      throw new FieldError('username', ErrorMessages.USER_ALREADY_HAVE_ACCESS);
    }

    collection.users.push(user);

    return await this.collectionRepo.save(collection);
  }

  public async removeUserFromCollection(
    id: string,
    user: User,
    requesterId: string,
  ): Promise<Collection> {
    const collection = await this.getById(id, true);
    if (collection === null) {
      throw new FieldError(
        'collectionId',
        ErrorMessages.COLLECTION_WITH_ID_DOES_NOT_EXIST,
      );
    }

    if (collection.owner.id !== requesterId) {
      throw new FieldError(
        'collectionId',
        ErrorMessages.YOU_CANNOT_MODIFY_COLLECTION,
      );
    }

    if (collection.owner.id === user.id) {
      throw new FieldError(
        'username',
        ErrorMessages.OWNER_CANNOT_REMOVE_ITSELF,
      );
    }

    const indexOfUser = collection.users.findIndex(
      (collectionUser) => collectionUser.id === user.id,
    );

    if (indexOfUser === -1) {
      throw new FieldError('username', ErrorMessages.USER_DOES_NOT_HAVE_ACCESS);
    }
    collection.users.splice(indexOfUser, 1);
    return await this.collectionRepo.save(collection);
  }
}
