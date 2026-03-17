import { IsString, IsOptional, IsIn, IsInt, Min, Max, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTotpDto {
  @ApiProperty({ example: 'GitHub' })
  @IsString()
  issuer: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsString()
  accountName: string;

  @ApiProperty({ example: 'JBSWY3DPEHPK3PXP', description: 'Base32-encoded secret' })
  @IsString()
  @Matches(/^[A-Z2-7]+=*$/i, { message: 'Secret must be a valid Base32 string' })
  secret: string;

  @ApiPropertyOptional({ enum: ['SHA1', 'SHA256', 'SHA512'], default: 'SHA1' })
  @IsOptional()
  @IsIn(['SHA1', 'SHA256', 'SHA512'])
  algorithm?: string;

  @ApiPropertyOptional({ default: 6, minimum: 6, maximum: 8 })
  @IsOptional()
  @IsInt()
  @Min(6)
  @Max(8)
  digits?: number;

  @ApiPropertyOptional({ default: 30, minimum: 15, maximum: 120 })
  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(120)
  period?: number;
}
