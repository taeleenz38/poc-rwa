import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { LiquidAssetsService } from './liquid-assets.service';
import { LiquidAssetsRequestDto } from './dto/liquid-assets-request.dto';
import { LiquidAssets } from './entities/liquid-assets.entity';
import { VLRNAVFeedResponseDto } from './dto/chainlink-vlr-response.dto';

@Controller('liquid-assets')
export class LiquidAssetsController {
  constructor(private readonly liquidAssetsService: LiquidAssetsService) {}

  @Post('submit')
  async submitLiquidAssets(
    @Body() liquidAssetsRequestDto: LiquidAssetsRequestDto,
  ): Promise<{ message: string; data: LiquidAssets }> {
    const savedData = await this.liquidAssetsService.saveLiquidAssets(
      liquidAssetsRequestDto,
    );
    return {
      message: 'Liquid assets data saved successfully',
      data: savedData,
    };
  }

  // New endpoint to list all records
  @Get('list')
  async list(@Query('skip') skip: string, @Query('take') take: string) {
    const parsedSkip = parseInt(skip) || 0; // Default to 0 if no value is passed
    const parsedTake = parseInt(take) || 10; // Default to 10 if no value is passed

    const result = await this.liquidAssetsService.listAssetsPaginated(
      parsedSkip,
      parsedTake,
    );

    return {
      data: result.data,
      metadata: {
        totalCount: result.count,
        totalPages: result.totalPages,
        currentPage: Math.ceil(result.count / parsedTake),
        skip: parsedSkip,
        take: parsedTake,
      },
    };
  }

  // New endpoint to send data to Chainlink for AUDY
  @Get('chainlink/vlr')
  async chainlinkAudy(): Promise<VLRNAVFeedResponseDto> {
    const navFeed = await this.liquidAssetsService.chainlinkAudy();

    if (!navFeed) {
      // Handle case where there's no data available
      return {
        accountName: 'VLR',
        NAV: 0,
        updatedAt: new Date().toISOString(),
        token: [
          {
            tokenName: 'VLR',
            totalTokenByChain: 0,
          },
        ],
        ripcord: false,
        ripcordDetails: [],
      };
    }

    return navFeed;
  }
}
