import { RefreshTokenDto } from '@modules/auth/application/dto/refresh-token.dto';
import { RedisService } from '@modules/redis/application/services/redis.service';
import { AuthenticatedUserUseCase } from '@modules/user/application/use-cases/authenticated-user.use-case';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { hashStringSHA256 } from '@common/utils';
import { TokenService } from '@modules/auth/application/services/token.service';
import { TokenInvalidException } from '@common/exceptions/token.exception';
import { GetUserByIdUseCase } from '@modules/user/application/use-cases/get-user-by-id.use-case';
import { UserNotFoundException } from '@common/exceptions/user.exception';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly authenticatedUserUseCase: AuthenticatedUserUseCase,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly tokenService: TokenService,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  async execute(
    dto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {

    await this.checkRefreshTokenValid(dto);


    const expiresAt = new Date(
      Date.now() + this.configService.get('JWT_REFRESH_EXP') * 1000,
    );

    await this.redisService.set(
      `refresh_token:${hashedRefreshToken}`,
      userId,
      this.configService.get('JWT_REFRESH_EXP', 25200), // TTL theo giây
    );

    return { accessToken, refreshToken };
  }

  /**
   * Kiểm tra refresh token hợp lệ trong Redis
   */
  async checkRefreshTokenValid(dto: RefreshTokenDto): Promise<void> {
    // BƯỚC 1: Giải mã và xác thực refresh token
    const decoded = this.jwtService.verify(dto.refreshToken);
    if (!decoded) throw new TokenInvalidException();

    // BƯỚC 2: Lấy user từ DB và kiểm tra tồn tại
    const user = await this.getUserByIdUseCase.execute(decoded.sub);
    if (!user) {
      throw new UserNotFoundException();
    }
    // BƯỚC 3: Kiểm tra refresh token trong Redis
    const hashedRefreshToken = hashStringSHA256(dto.refreshToken);
    const exists = await this.redisService.get(
      `refresh_token:${hashedRefreshToken}`,
    );
    if (!exists) {
      throw new TokenInvalidException();
    }
  }
}
