import { Response } from 'express';
import { CustomRequest } from './custom-request.interfaces';

export interface GqlContext {
  req: CustomRequest;
  res: Response;
}
