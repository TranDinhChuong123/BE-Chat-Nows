import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hashStringSHA256 } from '@common/utils';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Tạo access token và refresh token
   * @param payload Dữ liệu để mã hóa trong token
   * @returns access token và refresh token
   */
  generateTokens(payload: object): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get<number>('JWT_ACCESS_EXP', 900), // 15 phút
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get<number>('JWT_REFRESH_EXP', 25200), // 7 ngày
      }),
    };
  }

  hashToken(token: string): string {
    return hashStringSHA256(token);
  }
}
