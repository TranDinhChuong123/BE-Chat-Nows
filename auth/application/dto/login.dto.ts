import { IsEmail, IsString } from 'class-validator';

import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DeviceInfoDto {
  @IsString()
  deviceId: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  platform?: string;
}

export class LoginReqDto {
  @IsEmail()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  deviceInfo?: DeviceInfoDto;
}
export class LoginResDto {
  @IsString()
  accessToken: string;
  refreshToken: string;
}
