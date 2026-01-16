import { hashStringSHA256 } from '@common/utils';
import { LoginReqDto } from '@modules/auth/application/dto/login.dto';
import { RegisterReqDto } from '@modules/auth/application/dto/register.dto';
import { LoginPresenter } from '@modules/auth/application/presenters/login.presenter';
import { TokenService } from '@modules/auth/application/services/token.service';
import { LoginUseCase } from '@modules/auth/application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '@modules/auth/application/use-cases/refresh-token.use-case';
import { RegisterUseCase } from '@modules/auth/application/use-cases/register.use-case';
import { IAuthService } from '@modules/auth/domain/services/auth.service.interface';
import { UserDeviceSessionRedisService } from '@modules/user-device/infrastructure/redis/user-device-redis.service';
import { AuthenticatedUserUseCase } from '@modules/user/application/use-cases/authenticated-user.use-case';
import { GetUserByIdUseCase } from '@modules/user/application/use-cases/get-user-by-id.use-case';
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Inject,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,

    private readonly loginPresenter: LoginPresenter,

    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginReqDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {

    const deviceId = this.identifyDeviceUseCase.execute(
      req,
      res,
      dto.deviceInfo?.deviceId,
    );
    dto.deviceInfo?.deviceId = deviceId;
    const result = await this.loginUseCase.execute(dto);
    return this.loginPresenter.present(res, result);
  }
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterReqDto) {
    return await this.registerUseCase.execute(registerDto);
  }

  // @Post('logout')
  // @UseGuards(JwtAuthGuard)
  // async logout(@Req() req: Request & { user: User }) {
  //   const deviceId = req.headers['x-device-id'] as string;
  //   await this.deviceSessionRedis.revokeDevice(req.user.id, deviceId);
  //   return { message: 'Logged out' };
  // }

  // @Post('logout-all')
  // @UseGuards(JwtAuthGuard)
  // async logoutAll(@Req() req: Request & { user: User }) {
  //   await this.deviceSessionRedis.revokeAllDevices(req.user.id);
  //   return { message: 'All devices logged out' };
  // }
}
