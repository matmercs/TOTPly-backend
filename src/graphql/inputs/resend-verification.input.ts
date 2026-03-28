import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class ResendVerificationInput {
  @Field({ description: 'User email address' })
  @IsEmail()
  email: string;
}
