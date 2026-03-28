import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
  @Field({ description: 'Whether email code verification is required' })
  requireEmailCode: boolean;

  @Field({ description: 'Temporary token for login verification' })
  tempToken: string;
}

@ObjectType()
export class AuthTokenResponse {
  @Field({ description: 'JWT session token' })
  token: string;
}
