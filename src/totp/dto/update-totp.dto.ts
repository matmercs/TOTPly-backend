import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTotpDto {
  @ApiPropertyOptional({ example: 'GitHub' })
  @IsOptional()
  @IsString()
  issuer?: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsString()
  accountName?: string;
}
