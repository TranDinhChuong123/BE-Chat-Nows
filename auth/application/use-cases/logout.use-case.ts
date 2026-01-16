import { hashStringSHA256 } from '@common/utils';
import { RedisService } from '@modules/redis/application/services/redis.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly redisService: RedisService) {}

  async execute(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = hashStringSHA256(refreshToken);

    const userTokenKey = `user:${userId}:refresh_token`;
    const tokenKey = `refresh_token:${hashedRefreshToken}`;

    const storedHashedToken = await this.redisService.get(userTokenKey);

    // Nếu không có mapping → có thể đã logout rồi → không cần làm gì
    if (!storedHashedToken) {
      return; // hoặc throw nếu muốn strict
    }

    // 3. (Tùy chọn) Kiểm tra token có khớp không
    if (storedHashedToken !== hashedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 4. Xóa cả 2 key (nếu tồn tại)
    await Promise.all([
      this.redisService.del(tokenKey),
      this.redisService.del(userTokenKey),
    ]);
  }
}
