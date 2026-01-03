import type { Request } from 'express';

export function getBearerToken(req: Request): string | undefined {
  const authorization = req.headers['authorization'];
  if (!authorization) return undefined;
  const [scheme, token] = authorization.split(' ');
  if (!scheme || !token) return undefined;
  if (!/^Bearer$/i.test(scheme)) return undefined;
  return token;
}
