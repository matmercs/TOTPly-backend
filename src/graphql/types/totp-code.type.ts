import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class TotpCode {
  @Field({ description: 'Generated TOTP code' })
  code: string;

  @Field(() => Int, { description: 'Seconds remaining until code expires' })
  remainingSeconds: number;

  @Field(() => Int, { description: 'Code rotation period in seconds' })
  period: number;

  @Field(() => Int, { description: 'Server time in milliseconds' })
  serverTime: number;
}
