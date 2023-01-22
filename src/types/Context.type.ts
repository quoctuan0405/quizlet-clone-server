import { Request, Response } from 'express';
import { User } from '@prisma/client';

export type Ctx = {
  req: Request & { user: Pick<User, 'username'> & Pick<User, 'id'> };
  res: Response;
};
