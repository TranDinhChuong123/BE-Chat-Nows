import { hashStringSHA256 } from '@common/utils';
import { TokenService } from '@modules/auth/application/services/token.service';
import { DeviceSessionRedisService } from '@modules/user-device/infrastructure/redis/user-device-redis.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class LoginPresenter {
  constructor(
    private readonly tokenService: TokenService,
    private readonly deviceSessionRedis: DeviceSessionRedisService,
    private readonly configService: ConfigService,
  ) {}

  present(res: Response, data: any) {

    const isProd = this.configService.get('NODE_ENV') === 'production';

    res.cookie('access_token', data.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', data.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/api/auth',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { user: data.user, device: data.device };
  }
}
