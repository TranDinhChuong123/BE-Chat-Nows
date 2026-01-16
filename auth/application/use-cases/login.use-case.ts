import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { LoginReqDto } from '@modules/auth/application/dto/login.dto';
import { TokenService } from '@modules/auth/application/services/token.service';
import { UserDevice } from '@modules/user-device/domain/entities/user-device.entity';
import { UserDeviceRepository } from '@modules/user-device/infrastructure/repositories/user-device.repository';
import { AuthenticatedUserUseCase } from '@modules/user/application/use-cases/authenticated-user.use-case';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly authenticatedUserUseCase: AuthenticatedUserUseCase,
    private readonly userDeviceRepository: UserDeviceRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: LoginReqDto): Promise<any> {
    const user = await this.authenticatedUserUseCase.execute(dto);


    const deviceRecord = new UserDevice();
    deviceRecord.userId = user.id!;
    deviceRecord.deviceId = deviceId;
    deviceRecord.deviceName = deviceMeta.name;
    deviceRecord.platform = deviceMeta.platform;
    deviceRecord.ip = deviceMeta.ip;
    deviceRecord.userAgent = deviceMeta.userAgent;
    deviceRecord.lastLogin = Date.now();
    await this.userDeviceRepository.upsertDevice(deviceRecord);

    const { accessToken, refreshToken } = this.tokenService.generateTokens({
      sub: user.id!,
      jti: uuidv4(),
      deviceId: deviceId,
    });

    const refreshTokenHash = this.tokenService.hashToken(refreshToken);

    return {
      user: { id: user.id, profile: user.profile },
      device: {
        id: deviceId,
        name: deviceMeta.name,
        deviceId,
        token: {
          accessToken,
          refreshToken,
        },
      },
    };
  }

  // Helper nhỏ (tùy chọn)
  private extractDeviceName(userAgent?: string): string {
    if (!userAgent) return 'Unknown Device';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    return 'Web Browser';
  }
}
