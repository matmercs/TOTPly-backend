import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { JwtGuard } from '../../auth/jwt.guard';
import { RegisterInput } from '../inputs/register.input';
import { LoginInput } from '../inputs/login.input';
import { VerifyLoginInput } from '../inputs/verify-login.input';
import { VerifyEmailInput } from '../inputs/verify-email.input';
import { ResendVerificationInput } from '../inputs/resend-verification.input';
import { MessageResponse } from '../types/message.type';
import { LoginResponse, AuthTokenResponse } from '../types/auth-response.type';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => MessageResponse, { description: 'Register a new user' })
  async register(@Args('input') input: RegisterInput): Promise<MessageResponse> {
    return this.authService.register(input.email, input.password);
  }

  @Mutation(() => LoginResponse, { description: 'Login and receive a temporary token' })
  async login(@Args('input') input: LoginInput): Promise<LoginResponse> {
    return this.authService.login(input.email, input.password);
  }

  @Mutation(() => AuthTokenResponse, { description: 'Verify login with email code' })
  async verifyLogin(
    @Args('input') input: VerifyLoginInput,
    @Context() ctx: any,
  ): Promise<AuthTokenResponse> {
    const userAgent = ctx.req.headers['user-agent'];
    return this.authService.verifyLogin(input.tempToken, input.code, userAgent);
  }

  @Mutation(() => AuthTokenResponse, { description: 'Verify email with code' })
  async verifyEmail(
    @Args('input') input: VerifyEmailInput,
    @Context() ctx: any,
  ): Promise<AuthTokenResponse> {
    const userAgent = ctx.req.headers['user-agent'];
    return this.authService.verifyEmail(input.email, input.code, userAgent);
  }

  @Mutation(() => MessageResponse, { description: 'Resend email verification code' })
  async resendVerification(
    @Args('input') input: ResendVerificationInput,
  ): Promise<MessageResponse> {
    return this.authService.resendVerification(input.email);
  }

  @Mutation(() => MessageResponse, { description: 'Logout and invalidate session' })
  @UseGuards(JwtGuard)
  async logout(@Context() ctx: any): Promise<MessageResponse> {
    return this.authService.logout(ctx.req.user.sessionId);
  }
}
