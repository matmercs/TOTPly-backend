import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './jwt.guard';
import { AuthResolver } from '../graphql/resolvers/auth.resolver';

@Module({
  imports: [
    PrismaModule,
    EmailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: Number(process.env.JWT_EXPIRES) },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard, AuthResolver],
  exports: [AuthService, JwtGuard, JwtModule],
})
export class AuthModule {}