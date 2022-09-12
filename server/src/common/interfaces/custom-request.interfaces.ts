import { Request } from 'express';
import { Session } from 'express-session';

export interface CustomRequest extends Request {
  session: CustomSession;
}

export interface CustomSession extends Session {
  userId: string;
}
