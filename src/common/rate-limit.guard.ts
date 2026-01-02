import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

type Bucket = { count: number; resetAt: number };

@Injectable()
export class RateLimitGuard implements CanActivate {
  private buckets = new Map<string, Bucket>();
  private readonly windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000);
  private readonly max = Number(process.env.RATE_LIMIT_MAX ?? 60);

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const key = req.ip ?? 'unknown';
    const now = Date.now();
    const current = this.buckets.get(key);
    if (!current || now > current.resetAt) {
      this.buckets.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }
    if (current.count < this.max) {
      current.count += 1;
      return true;
    }
    return false;
  }
}
