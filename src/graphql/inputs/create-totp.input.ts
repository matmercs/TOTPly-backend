import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsIn, IsInt, Min, Max, Matches } from 'class-validator';

@InputType()
export class CreateTotpInput {
  @Field({ description: 'Service name (e.g. GitHub)' })
  @IsString()
  issuer: string;

  @Field({ description: 'Account name (e.g. user@example.com)' })
  @IsString()
  accountName: string;

  @Field({ description: 'Base32-encoded TOTP secret' })
  @IsString()
  @Matches(/^[A-Z2-7]+=*$/i, { message: 'Secret must be a valid Base32 string' })
  secret: string;

  @Field({ nullable: true, description: 'TOTP algorithm (SHA1, SHA256, SHA512)' })
  @IsOptional()
  @IsIn(['SHA1', 'SHA256', 'SHA512'])
  algorithm?: string;

  @Field(() => Int, { nullable: true, description: 'Number of digits (6-8)' })
  @IsOptional()
  @IsInt()
  @Min(6)
  @Max(8)
  digits?: number;

  @Field(() => Int, { nullable: true, description: 'Code rotation period in seconds (15-120)' })
  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(120)
  period?: number;
}
