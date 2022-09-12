import { User } from '@database/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import argon2 from 'argon2';
import { UsernamePasswordInput } from '@resolvers/user/user.gql-types';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  public async create(userData: UsernamePasswordInput): Promise<User> {
    const hashedPassword = await argon2.hash(userData.password);
    const user = new User();
    user.username = userData.username;
    user.password = hashedPassword;

    return await this.userRepo.save(user);
  }

  public async getByUsername(username: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: {
        username,
      },
    });
  }

  public async getById(
    id: string,
    loadRelations = false,
  ): Promise<User | null> {
    let relations = {};
    if (loadRelations) {
      relations = {
        collections: true,
      };
    }

    return await this.userRepo.findOne({
      where: {
        id,
      },
      relations,
    });
  }

  public async getForCollection(collectionId: string): Promise<User[]> {
    return await this.userRepo.find({
      where: {
        collections: {
          id: collectionId,
        },
      },
    });
  }
}
