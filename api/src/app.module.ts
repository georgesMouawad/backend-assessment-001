import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JustanameModule } from './modules/justaname/justaname.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [JustanameModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
