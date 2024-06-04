import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClaimService } from './services/justaname/justaname.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ClaimService],
})
export class AppModule { }
