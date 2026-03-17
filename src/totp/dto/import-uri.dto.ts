import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportUriDto {
  @ApiProperty({ example: 'otpauth://totp/GitHub:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=GitHub' })
  @IsString()
  @Matches(/^otpauth:\/\/totp\//, { message: 'Must be a valid otpauth://totp/ URI' })
  uri: string;
}
