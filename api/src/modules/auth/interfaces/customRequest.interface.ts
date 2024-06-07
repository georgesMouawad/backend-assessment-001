import { Request } from 'express';

export interface CustomRequest extends Request {
  session: {
    siwe: {
      address: string;
    };
  };
}
