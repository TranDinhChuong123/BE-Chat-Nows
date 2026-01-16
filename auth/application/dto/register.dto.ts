import { GenderType } from '@modules/user/domain/entities/enums/gender.enum';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class RegisterReqDto {
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  dateOfBirth: Date;

  @IsEnum(GenderType)
  gender: GenderType; // Assuming GenderType is an enum or class defined elsewhere
}

export class RegisterResDto {
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsEmail()
  email: string;
}
