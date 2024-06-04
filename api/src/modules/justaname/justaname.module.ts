import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JustaNameService } from './justaname.service';
import { JustaNameController } from './justaname.controller';

@Module({
  imports: [ConfigModule],
  providers: [JustaNameService],
  controllers: [JustaNameController]
})
export class JustanameModule {}
