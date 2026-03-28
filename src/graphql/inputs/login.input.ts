import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class LoginInput {
  @Field({ description: 'User email address' })
  @IsEmail()
  email: string;

  @Field({ description: 'User password' })
  @IsString()
  password: string;
}
