import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerifyLoginDto } from './dto/verify-login.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { Throttle } from '@nestjs/throttler';
import { JwtGuard } from './jwt.guard';
import type { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered, verification email sent' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 201, description: 'Temporary token returned, email code sent' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('verify-login')
  @ApiOperation({ summary: 'Verify login with email code' })
  @ApiResponse({ status: 201, description: 'Access token returned' })
  @ApiResponse({ status: 401, description: 'Invalid or expired code' })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async verifyLogin(@Body() dto: VerifyLoginDto, @Req() req: Request) {
    return this.authService.verifyLogin(dto.tempToken, dto.code, req.headers['user-agent']);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email address' })
  @ApiResponse({ status: 201, description: 'Email verified, access token returned' })
  @ApiResponse({ status: 400, description: 'Invalid or expired code' })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async verifyEmail(@Body() dto: VerifyEmailDto, @Req() req: Request) {
    return this.authService.verifyEmail(dto.email, dto.code, req.headers['user-agent']);
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend email verification code' })
  @ApiResponse({ status: 201, description: 'Verification code resent' })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerification(dto.email);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and invalidate session' })
  @ApiResponse({ status: 201, description: 'Session invalidated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  async logout(@Req() req: Request) {
    const user = req['user'] as any;
    return this.authService.logout(user.sessionId);
  }
}