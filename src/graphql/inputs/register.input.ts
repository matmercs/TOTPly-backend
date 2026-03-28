import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field({ description: 'User email address' })
  @IsEmail()
  email: string;

  @Field({ description: 'Password (min 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;
}
