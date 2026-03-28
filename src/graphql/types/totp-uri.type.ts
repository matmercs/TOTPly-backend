import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TotpUriResponse {
  @Field({ description: 'otpauth:// URI for the TOTP entry' })
  uri: string;
}
