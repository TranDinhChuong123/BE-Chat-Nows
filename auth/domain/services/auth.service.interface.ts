import {
  LoginReqDto,
  LoginResDto,
} from '@modules/auth/application/dto/login.dto';
import { RefreshTokenDto } from '@modules/auth/application/dto/refresh-token.dto';
import { RegisterReqDto } from '@modules/auth/application/dto/register.dto';
import { User } from '@modules/user/domain/entities/user.entity';

export interface IAuthService {
  login(loginDto: LoginReqDto): Promise<LoginResDto>;
  register(registerDto: RegisterReqDto): Promise<void>;
  getAuthenticatedUser(email: string, password: string): Promise<User | null>;
  refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }>;
  getUserById(userId: string): Promise<User | null>;
}
