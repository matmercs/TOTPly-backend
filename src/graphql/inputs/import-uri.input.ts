import { InputType, Field } from '@nestjs/graphql';
import { IsString, Matches } from 'class-validator';

@InputType()
export class ImportUriInput {
  @Field({ description: 'otpauth://totp/ URI to import' })
  @IsString()
  @Matches(/^otpauth:\/\/totp\//, { message: 'Must be a valid otpauth://totp/ URI' })
  uri: string;
}
