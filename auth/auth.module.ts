import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './presentation/controllers/auth.controller';

import { UserRepository } from '@modules/user/infrastructure/repositories/user.repository';
import { LoginUseCase } from '@modules/auth/application/use-cases/login.use-case';
import { RegisterUseCase } from '@modules/auth/application/use-cases/register.use-case';
import { AuthenticatedUserUseCase } from '@modules/user/application/use-cases/authenticated-user.use-case';
import { UserModule } from '@modules/user/user.module';
import {
  UserModel,
  UserSchema,
} from '@modules/user/infrastructure/schemas/user.schema';
import { LocalStrategy } from '@modules/auth/strategies/local.strategy';
import { JwtStrategy } from '@modules/auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '@modules/contact-request/presentation/guards/jwt-auth.guard';
import { RedisModule } from '@modules/redis/application/services/redis.module';
import { TokenService } from '@modules/auth/application/services/token.service';
import { RefreshTokenUseCase } from '@modules/auth/application/use-cases/refresh-token.use-case';
import { ConfigModule, ConfigService } from '@nestjs/config';

import * as fs from 'fs';
import * as path from 'path';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserSchema.name, schema: UserModel }]),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        privateKey: configService.get<string>('JWT_PRIVATE_KEY'), // string
        publicKey: configService.get<string>('JWT_PUBLIC_KEY'), // string
        signOptions: {
          algorithm: 'RS256',
        },
      }),
    }),
    forwardRef(() => UserModule),
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [
    UserRepository,
    JwtAuthGuard,
    LocalStrategy,
    JwtStrategy,
    LoginUseCase,
    RegisterUseCase,
    AuthenticatedUserUseCase,
    RefreshTokenUseCase,
    TokenService,
  ],
  exports: [],
})
export class AuthModule {}
