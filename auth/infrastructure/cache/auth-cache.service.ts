import { KeyvBaseService } from '@common/catch/keyv-base.service';
import { Injectable } from '@nestjs/common';

export interface CachedAuthUser {
  userId: string;
  roles: string[];
  permissions: string[];
  tenantId?: string;
  version: number;        // để tránh stale data
  iat: number;            // issued at (dùng để so sánh với token)
}

@Injectable()
export class AuthCacheService extends KeyvBaseService<CachedAuthUser> {
  constructor() {
    super('auth'); // namespace riêng → key sẽ là auth::user:123
  }

  private key(userId: string): string {
    return `user:${userId}`;
  }

  // Cache sau khi validate token thành công
  async setUser(user: CachedAuthUser, ttlMs = 10 * 60 * 1000): Promise<void> { // 10 phút
    await this.set(this.key(user.userId), { ...user, version: Date.now() }, ttlMs);
  }

  async getUser(userId: string): Promise<CachedAuthUser | null> {
    return this.get(this.key(userId));
  }

  // Logout, change password, revoke role → gọi cái này
  async invalidateUser(userId: string): Promise<void> {
    await this.delete(this.key(userId));
    // Nếu dùng microservices → publish event
    // this.eventEmitter.emit('auth.user.invalidated', { userId });
  }

  // Khi admin reset toàn bộ session của user (force logout all devices)
  async invalidateAllUserSessions(userId: string): Promise<void> {
    await this.delete(this.key(userId));
    // Tăng version trong DB hoặc Redis để lần sau validate token cũ sẽ fail
  }

  // Clear toàn bộ auth cache (khi rotate signing key, maintenance…)
  async clearAll(): Promise<void> {
    await super.clearAll();
  }
}