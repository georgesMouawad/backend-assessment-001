import { Request } from 'express';
import { Session, SessionData } from 'express-session';

export interface CustomRequest extends Request {
  session: Session & Partial<SessionData> & {
    siwe: {
      address: string;
    };
  };
}