import { AuthenticatedUserUseCase } from '@modules/user/application/use-cases/authenticated-user.use-case';
import { GetUserByIdUseCase } from '@modules/user/application/use-cases/get-user-by-id.use-case';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authenticatedUserUseCase: AuthenticatedUserUseCase,
  ) {
    super({ usernameField: 'username' });
  }

  async validate(username: string, password: string) {
    return await this.authenticatedUserUseCase.execute({
      username,
      password,
    });
  }
}
