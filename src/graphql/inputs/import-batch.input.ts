import { InputType, Field } from '@nestjs/graphql';
import { IsArray, IsString, Matches, ArrayMinSize } from 'class-validator';

@InputType()
export class ImportBatchInput {
  @Field(() => [String], { description: 'Array of otpauth://totp/ URIs' })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Matches(/^otpauth:\/\/totp\//, { each: true, message: 'Each URI must be a valid otpauth://totp/ URI' })
  uris: string[];
}
