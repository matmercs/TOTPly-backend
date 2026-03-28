import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let req: any;
    if (context.getType<string>() === 'graphql') {
      req = GqlExecutionContext.create(context).getContext().req;
    } else {
      req = context.switchToHttp().getRequest();
    }
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1] || req.query?.token;
    if (!token) throw new UnauthorizedException();

    try {
      const payload: any = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });

      if (payload.type !== 'session') {
        throw new UnauthorizedException();
      }

      const session = await this.prisma.session.findUnique({
        where: { id: payload.sessionId },
      });
      
      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedException();
      }

      // Проверяем tokenId (jti из JWT должен совпадать с tokenId в Session)
      if (payload.jti !== session.tokenId) {
        throw new UnauthorizedException();
      }

      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}