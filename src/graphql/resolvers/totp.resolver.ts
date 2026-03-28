import {
  Resolver, Query, Mutation, Args, Context,
  ResolveField, Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../auth/jwt.guard';
import { TotpService } from '../../totp/totp.service';
import { TotpEntry } from '../types/totp-entry.type';
import { TotpEntryDetail } from '../types/totp-entry-detail.type';
import { TotpCode } from '../types/totp-code.type';
import { TotpCodeWithEntry } from '../types/totp-code-with-entry.type';
import { TotpUriResponse } from '../types/totp-uri.type';
import { MessageResponse } from '../types/message.type';
import { PaginatedTotpEntries } from '../types/paginated-totp-entries.type';
import { CreateTotpInput } from '../inputs/create-totp.input';
import { UpdateTotpInput } from '../inputs/update-totp.input';
import { ImportUriInput } from '../inputs/import-uri.input';
import { ImportBatchInput } from '../inputs/import-batch.input';
import { PaginationInput } from '../inputs/pagination.input';

@Resolver(() => TotpEntry)
@UseGuards(JwtGuard)
export class TotpResolver {
  constructor(private totpService: TotpService) {}

  @Query(() => PaginatedTotpEntries, { name: 'totpEntries', description: 'Get paginated list of TOTP entries' })
  async getTotpEntries(
    @Context() ctx: any,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<PaginatedTotpEntries> {
    const userId = ctx.req.user.sub;
    const offset = pagination?.offset ?? 0;
    const limit = pagination?.limit ?? 20;

    const allEntries = await this.totpService.findAll(userId);
    const total = allEntries.length;
    const items = allEntries.slice(offset, offset + limit);

    return { items, total, offset, limit, hasMore: offset + limit < total };
  }

  @Query(() => TotpEntryDetail, { name: 'totpEntry', description: 'Get a single TOTP entry with decrypted secret' })
  async getTotpEntry(
    @Context() ctx: any,
    @Args('id') id: string,
  ): Promise<TotpEntryDetail> {
    return this.totpService.findOne(ctx.req.user.sub, id);
  }

  @Query(() => TotpCode, { name: 'generateCode', description: 'Generate current TOTP code for an entry' })
  async getCode(
    @Context() ctx: any,
    @Args('id') id: string,
  ): Promise<TotpCode> {
    return this.totpService.generateCode(ctx.req.user.sub, id);
  }

  @Query(() => [TotpCodeWithEntry], { name: 'generateAllCodes', description: 'Generate current codes for all entries' })
  async getAllCodes(@Context() ctx: any): Promise<TotpCodeWithEntry[]> {
    return this.totpService.generateAllCodes(ctx.req.user.sub);
  }

  @Query(() => TotpUriResponse, { name: 'totpUri', description: 'Get otpauth:// URI for an entry' })
  async getUri(
    @Context() ctx: any,
    @Args('id') id: string,
  ): Promise<TotpUriResponse> {
    return this.totpService.getUri(ctx.req.user.sub, id);
  }

  @Mutation(() => TotpEntry, { description: 'Create a new TOTP entry' })
  async createTotp(
    @Context() ctx: any,
    @Args('input') input: CreateTotpInput,
  ): Promise<TotpEntry> {
    return this.totpService.create(ctx.req.user.sub, input);
  }

  @Mutation(() => TotpEntry, { description: 'Update TOTP entry metadata' })
  async updateTotp(
    @Context() ctx: any,
    @Args('id') id: string,
    @Args('input') input: UpdateTotpInput,
  ): Promise<TotpEntry> {
    return this.totpService.update(ctx.req.user.sub, id, input);
  }

  @Mutation(() => MessageResponse, { description: 'Delete a TOTP entry' })
  async removeTotp(
    @Context() ctx: any,
    @Args('id') id: string,
  ): Promise<MessageResponse> {
    return this.totpService.remove(ctx.req.user.sub, id);
  }

  @Mutation(() => TotpEntry, { description: 'Import TOTP entry from otpauth:// URI' })
  async importFromUri(
    @Context() ctx: any,
    @Args('input') input: ImportUriInput,
  ): Promise<TotpEntry> {
    return this.totpService.importFromUri(ctx.req.user.sub, input.uri);
  }

  @Mutation(() => [TotpEntry], { description: 'Import multiple TOTP entries from URIs' })
  async importBatch(
    @Context() ctx: any,
    @Args('input') input: ImportBatchInput,
  ): Promise<TotpEntry[]> {
    return this.totpService.importBatch(ctx.req.user.sub, input.uris);
  }

  @ResolveField(() => TotpCode, { name: 'currentCode', nullable: true, description: 'Current TOTP code for this entry' })
  async getCurrentCode(
    @Parent() entry: TotpEntry,
    @Context() ctx: any,
  ): Promise<TotpCode | null> {
    try {
      return await this.totpService.generateCode(ctx.req.user.sub, entry.id);
    } catch {
      return null;
    }
  }
}
