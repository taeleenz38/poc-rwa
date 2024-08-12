import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { KycVerifcationService } from './verification.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],  
  controllers: [VerificationController],  
  providers: [KycVerifcationService],
})
export class VerificationModule {}