import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class TotpEntryDetail {
  @Field({ description: 'Unique identifier' })
  id: string;

  @Field({ description: 'Service name (e.g. GitHub)' })
  issuer: string;

  @Field({ description: 'Account name (e.g. user@example.com)' })
  accountName: string;

  @Field({ description: 'Decrypted TOTP secret in Base32' })
  secret: string;

  @Field({ description: 'TOTP algorithm (SHA1, SHA256, SHA512)' })
  algorithm: string;

  @Field(() => Int, { description: 'Number of digits in the code' })
  digits: number;

  @Field(() => Int, { description: 'Code rotation period in seconds' })
  period: number;

  @Field({ description: 'Creation timestamp' })
  createdAt: Date;

  @Field({ description: 'Last update timestamp' })
  updatedAt: Date;
}
