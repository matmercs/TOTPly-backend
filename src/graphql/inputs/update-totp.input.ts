import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@InputType()
export class UpdateTotpInput {
  @Field({ nullable: true, description: 'Service name' })
  @IsOptional()
  @IsString()
  issuer?: string;

  @Field({ nullable: true, description: 'Account name' })
  @IsOptional()
  @IsString()
  accountName?: string;
}
