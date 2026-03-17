import { IsArray, IsString, Matches, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportBatchDto {
  @ApiProperty({
    example: ['otpauth://totp/GitHub:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=GitHub'],
    description: 'Array of otpauth://totp/ URIs',
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Matches(/^otpauth:\/\/totp\//, { each: true, message: 'Each URI must be a valid otpauth://totp/ URI' })
  uris: string[];
}
