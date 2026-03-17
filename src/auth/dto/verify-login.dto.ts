import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyLoginDto {
  @ApiProperty({ description: 'Temporary token from login response' })
  @IsString()
  tempToken: string;

  @ApiProperty({ example: '123456', description: '6-digit email verification code' })
  @IsString()
  @Length(6, 6)
  code: string;
}
