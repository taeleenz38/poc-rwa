import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiquidAssets } from './entities/liquid-assets.entity';
import { LiquidAssetsService } from './liquid-assets.service';
import { LiquidAssetsController } from './liquid-assets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LiquidAssets])], // Register the LiquidAssets entity
  controllers: [LiquidAssetsController],
  providers: [LiquidAssetsService],
})
export class LiquidAssetsModule {}
