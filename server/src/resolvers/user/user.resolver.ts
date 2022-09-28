import { AppConfigService } from '@configs/app/app-config.service';
import { User } from '@database/entities/user.entity';
import { ErrorMessages } from '@enums/error-messages.enum';
import { GqlContext } from '@interfaces/gql.interfaces';
import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/middleware/auth.middleware';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';
import { UserResponse, UsernamePasswordInput } from './user.gql-types';

@Resolver(() => User)
export class UserResolver {
  public constructor(
    private userService: UserService,
    private authService: AuthService,
    private appConfigService: AppConfigService,
  ) {}

  @Query(() => User, { nullable: true })
  async me(@Context() { req }: GqlContext) {
    if (!req.session.userId) {
      return null;
    }

    const user = await this.userService.getById(req.session.userId);

    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Args('options') options: UsernamePasswordInput,
    @Context() { req }: GqlContext,
  ): Promise<UserResponse> {
    const user = await this.userService.getByUsername(options.username);

    if (user === null) {
      const createdUser = await this.userService.create(options);
      req.session.userId = createdUser.id;

      return {
        user: createdUser,
      };
    }

    return {
      errors: [
        {
          field: 'username',
          message: ErrorMessages.USERNAME_ALREADY_TAKEN,
        },
      ],
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Args('options') options: UsernamePasswordInput,
    @Context() { req }: GqlContext,
  ): Promise<UserResponse> {
    const user = await this.userService.getByUsername(options.username);

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

    const valid = await this.authService.verifyUserPassword(
      options.password,
      user,
    );

    if (valid) {
      req.session.userId = user.id;

      return {
        user,
      };
    }

    return {
      errors: [
        {
          field: 'password',
          message: ErrorMessages.INCORRECT_PASSWORD,
        },
      ],
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  logout(@Context() { req, res }: GqlContext): Promise<any> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(this.appConfigService.cookieName);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      }),
    );
  }
}
