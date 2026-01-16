// src/modules/auth/application/commands/login.command.ts

import { LoginReqDto } from "@modules/auth/application/dto/login.dto";

export class LoginCommand {
  constructor(
    public readonly dto: LoginReqDto,
    public readonly deviceId: string,
    public readonly ip: string,
    public readonly userAgent: string,
    public readonly deviceName: string,
    public readonly platform: string = 'web',
    public readonly appVersion?: string,
  ) {}
}
