import { User } from '@database/entities/user.entity';
import { Injectable } from '@nestjs/common';
import argon2 from 'argon2';

@Injectable()
export class AuthService {
  public async verifyUserPassword(passwordToCheck: string, user: User) {
    return await argon2.verify(user.password, passwordToCheck);
  }
}
