import { Controller, Get, Post, Patch, Delete, Body, Param, Req, Res, Sse, UseGuards, MessageEvent } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { TotpService } from './totp.service';
import { CreateTotpDto } from './dto/create-totp.dto';
import { UpdateTotpDto } from './dto/update-totp.dto';
import { ImportUriDto } from './dto/import-uri.dto';
import { ImportBatchDto } from './dto/import-batch.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import * as QRCode from 'qrcode';
import { Observable, interval, switchMap, map } from 'rxjs';

@ApiTags('TOTP')
@ApiBearerAuth()
@Controller('totp')
@UseGuards(JwtGuard)
export class TotpController {
  constructor(private totpService: TotpService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new TOTP entry' })
  @ApiResponse({ status: 201, description: 'TOTP entry created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Req() req: Request, @Body() dto: CreateTotpDto) {
    const user = req['user'] as any;
    return this.totpService.create(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all TOTP entries' })
  @ApiResponse({ status: 200, description: 'List of TOTP entries' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Req() req: Request) {
    const user = req['user'] as any;
    return this.totpService.findAll(user.sub);
  }

  @Get('codes')
  @ApiOperation({ summary: 'Get current codes for all TOTP entries' })
  @ApiResponse({ status: 200, description: 'List of current TOTP codes' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  async getAllCodes(@Req() req: Request) {
    const user = req['user'] as any;
    return this.totpService.generateAllCodes(user.sub);
  }

  @Sse('codes/stream')
  @ApiOperation({ summary: 'SSE stream of TOTP codes (updates every 2s)' })
  @ApiResponse({ status: 200, description: 'SSE event stream' })
  codesStream(@Req() req: Request): Observable<MessageEvent> {
    const user = req['user'] as any;
    return interval(2000).pipe(
      switchMap(() => this.totpService.generateAllCodes(user.sub)),
      map((codes) => ({ data: codes }) as MessageEvent),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single TOTP entry' })
  @ApiParam({ name: 'id', description: 'TOTP entry ID' })
  @ApiResponse({ status: 200, description: 'TOTP entry details' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const user = req['user'] as any;
    return this.totpService.findOne(user.sub, id);
  }

  @Get(':id/code')
  @ApiOperation({ summary: 'Generate current TOTP code' })
  @ApiParam({ name: 'id', description: 'TOTP entry ID' })
  @ApiResponse({ status: 200, description: 'Current TOTP code with remaining seconds' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  async getCode(@Req() req: Request, @Param('id') id: string) {
    const user = req['user'] as any;
    return this.totpService.generateCode(user.sub, id);
  }

  @Get(':id/uri')
  @ApiOperation({ summary: 'Get otpauth:// URI for entry' })
  @ApiParam({ name: 'id', description: 'TOTP entry ID' })
  @ApiResponse({ status: 200, description: 'otpauth URI' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async getUri(@Req() req: Request, @Param('id') id: string) {
    const user = req['user'] as any;
    return this.totpService.getUri(user.sub, id);
  }

  @Get(':id/qr')
  @ApiOperation({ summary: 'Get QR code image for entry' })
  @ApiParam({ name: 'id', description: 'TOTP entry ID' })
  @ApiResponse({ status: 200, description: 'QR code PNG image' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async getQr(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
    const user = req['user'] as any;
    const { uri } = await this.totpService.getUri(user.sub, id);
    const qrBuffer = await QRCode.toBuffer(uri, { type: 'png', width: 256 });
    res.set({ 'Content-Type': 'image/png', 'Cache-Control': 'no-store' });
    res.send(qrBuffer);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a TOTP entry' })
  @ApiParam({ name: 'id', description: 'TOTP entry ID' })
  @ApiResponse({ status: 200, description: 'Entry updated' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  async update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateTotpDto) {
    const user = req['user'] as any;
    return this.totpService.update(user.sub, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a TOTP entry' })
  @ApiParam({ name: 'id', description: 'TOTP entry ID' })
  @ApiResponse({ status: 200, description: 'Entry deleted' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  async remove(@Req() req: Request, @Param('id') id: string) {
    const user = req['user'] as any;
    return this.totpService.remove(user.sub, id);
  }

  @Post('import/uri')
  @ApiOperation({ summary: 'Import TOTP entry from otpauth URI' })
  @ApiResponse({ status: 201, description: 'Entry imported' })
  @ApiResponse({ status: 400, description: 'Invalid URI' })
  async importUri(@Req() req: Request, @Body() dto: ImportUriDto) {
    const user = req['user'] as any;
    return this.totpService.importFromUri(user.sub, dto.uri);
  }

  @Post('import/batch')
  @ApiOperation({ summary: 'Import multiple TOTP entries from URIs' })
  @ApiResponse({ status: 201, description: 'Entries imported' })
  @ApiResponse({ status: 400, description: 'Invalid URIs' })
  async importBatch(@Req() req: Request, @Body() dto: ImportBatchDto) {
    const user = req['user'] as any;
    return this.totpService.importBatch(user.sub, dto.uris);
  }
}
