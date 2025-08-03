import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    sub: string; // or number, depending on your auth provider
    [key: string]: any; // allows extra user properties
  };
}
