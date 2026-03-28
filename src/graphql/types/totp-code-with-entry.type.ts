import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class TotpCodeWithEntry {
  @Field({ description: 'Entry identifier' })
  id: string;

  @Field({ description: 'Service name' })
  issuer: string;

  @Field({ description: 'Account name' })
  accountName: string;

  @Field({ description: 'Generated TOTP code' })
  code: string;

  @Field(() => Int, { description: 'Seconds remaining until code expires' })
  remainingSeconds: number;
}
