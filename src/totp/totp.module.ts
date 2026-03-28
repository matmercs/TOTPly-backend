import { Module } from '@nestjs/common';
import { TotpService } from './totp.service';
import { TotpCodeService } from './totp-code.service';
import { UriParserService } from './uri-parser.service';
import { TotpController } from './totp.controller';
import { AuthModule } from '../auth/auth.module';
import { TotpResolver } from '../graphql/resolvers/totp.resolver';

@Module({
  imports: [AuthModule],
  controllers: [TotpController],
  providers: [TotpService, TotpCodeService, UriParserService, TotpResolver],
  exports: [TotpService],
})
export class TotpModule {}
