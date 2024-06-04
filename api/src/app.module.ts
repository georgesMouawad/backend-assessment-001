import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JustanameModule } from './modules/justaname/justaname.module';

@Module({
  imports: [JustanameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
