import {
  EMAIL_ALREADY_EXISTS,
  PHONE_ALREADY_EXISTS,
} from '@common/exceptions/user.exception';
import { RegisterReqDto } from '@modules/auth/application/dto/register.dto';
import { IUserRepository } from '@modules/user/domain/repositories/user.repository.interface';
import { UserMapper } from '@modules/user/infrastructure/mappers/user.mapper';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(registerDto: RegisterReqDto): Promise<void> {
    console.log('registerDto:', registerDto);

    const existingUser = await this.userRepository.findOneByCondition({
      'contact.phone': registerDto.phone,
    });

    if (existingUser) {
      throw PHONE_ALREADY_EXISTS;
    }

    const newUser = UserMapper.toDomainFromRegisterReq(registerDto);
    newUser.password = await this.hashPassword(newUser.password);

    const savedUser = await this.userRepository.create(newUser);

    // Gửi email xác nhận nếu cần
    // await this.emailService.sendVerificationEmail(newUser.contact.email);

    const payload = { sub: newUser.id, email: newUser.contact.email };
    const accessToken = this.jwtService.sign(payload);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
