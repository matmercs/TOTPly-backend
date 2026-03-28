import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, Length } from 'class-validator';

@InputType()
export class VerifyEmailInput {
  @Field({ description: 'User email address' })
  @IsEmail()
  email: string;

  @Field({ description: '6-digit verification code from email' })
  @IsString()
  @Length(6, 6)
  code: string;
}
