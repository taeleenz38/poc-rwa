import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { KycVerifcationService } from './verification/verification.service';
import { AppController } from './verification/verification.controller';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [KycVerifcationService],
})
export class AppModule {}
