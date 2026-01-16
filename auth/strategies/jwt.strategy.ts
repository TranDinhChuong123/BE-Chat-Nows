import { GetUserByIdUseCase } from '@modules/user/application/use-cases/get-user-by-id.use-case';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly getUserByIdUseCase: GetUserByIdUseCase) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'supersecretkey',
    });
  }

  async validate(payload: any) {
    return await this.getUserByIdUseCase.execute(payload.sub);
  }
}
