import { registerEnumType } from '@nestjs/graphql';

export enum RequestMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

registerEnumType(RequestMethods, {
  name: 'RequestMethods',
});
