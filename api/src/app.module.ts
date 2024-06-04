import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClaimService } from './services/claim/claim.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ClaimService],
})
export class AppModule {}
