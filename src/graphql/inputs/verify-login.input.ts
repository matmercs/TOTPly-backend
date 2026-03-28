import { InputType, Field } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@InputType()
export class VerifyLoginInput {
  @Field({ description: 'Temporary token received from login' })
  @IsString()
  tempToken: string;

  @Field({ description: '6-digit verification code from email' })
  @IsString()
  @Length(6, 6)
  code: string;
}
