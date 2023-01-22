import * as jwt from 'jsonwebtoken';

export const signJwt = (
  payload: string | Object | Buffer,
  expiresIn: string | number,
) => {
  return jwt.sign(payload, process.env.PRIVATE_KEY as string, {
    algorithm: 'RS256',
    expiresIn,
  });
};

export const decode = (token: string) => {
  if (!token) {
    return { payload: null, expired: 'jwt expired' };
  }

  try {
    const decoded = jwt.verify(token, process.env.PUBLIC_KEY as string);
    return { payload: decoded, expired: false };
  } catch (exception) {
    return { payload: null, expired: 'jwt expired' };
  }
};
