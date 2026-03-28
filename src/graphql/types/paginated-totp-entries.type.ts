import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TotpEntry } from './totp-entry.type';

@ObjectType()
export class PaginatedTotpEntries {
  @Field(() => [TotpEntry], { description: 'List of TOTP entries' })
  items: TotpEntry[];

  @Field(() => Int, { description: 'Total number of entries' })
  total: number;

  @Field(() => Int, { description: 'Current offset' })
  offset: number;

  @Field(() => Int, { description: 'Page size limit' })
  limit: number;

  @Field({ description: 'Whether more entries exist beyond current page' })
  hasMore: boolean;
}
