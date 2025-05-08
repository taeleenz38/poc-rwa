import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LiquidAssets } from './entities/liquid-assets.entity';
import { LiquidAssetsRequestDto } from './dto/liquid-assets-request.dto';
import { VLRNAVFeedResponseDto } from './dto/chainlink-vlr-response.dto';
import { LiquidAssetsResponseDto } from './dto/liquid-assets-response.dto';

@Injectable()
export class LiquidAssetsService {
  constructor(
    @InjectRepository(LiquidAssets)
    private readonly liquidAssetsRepository: Repository<LiquidAssets>, // Inject the repository for the LiquidAssets entity
  ) {}

  async saveLiquidAssets(data: LiquidAssetsRequestDto): Promise<LiquidAssets> {
    // Create a new LiquidAssets entity instance
    const liquidAssets = this.liquidAssetsRepository.create(data);
    liquidAssets.createDate = new Date();
    liquidAssets.updateDate = new Date();
    liquidAssets.isDeleted = false;
    // Save the data into the database
    return this.liquidAssetsRepository.save(liquidAssets);
  }
  // New method to fetch all records ordered by createDate (latest first)
  // async getAllLiquidAssets(): Promise<LiquidAssets[]> {
  //   return this.liquidAssetsRepository.find({
  //     order: { createDate: 'DESC' }, // Order by createDate in descending order
  //   });
  // }

  async listAssetsPaginated(skip = 0, take = 10) {
    const [data, count] = await this.liquidAssetsRepository.findAndCount({
      order: { createDate: 'DESC' },
      skip,
      take,
    });

    const result = await Promise.all(
      data.map(async (asset) => {
        // Map to DTO
        return this.mapToDto(asset);
      }),
    );

    return {
      data: result,
      count,
      totalPages: Math.ceil(count / take),
    };
  }

  private mapToDto(asset: LiquidAssets): LiquidAssetsResponseDto {
    return {
      id: asset.id,
      totalDailyLiquidAssets: asset.totalDailyLiquidAssets,
      totalWeeklyLiquidAssets: asset.totalWeeklyLiquidAssets,
      TotalAssetsValue: asset.TotalAssetsValue,
      createDate: asset.createDate,
      updateDate: asset.updateDate,
      isDeleted: asset.isDeleted,
      percentageDailyLiquidAssets: asset.percentageDailyLiquidAssets,
      percentageWeeklyLiquidAssets: asset.percentageWeeklyLiquidAssets,
      date: asset.date,
    };
  }

  // New method to fetch the latest LiquidAssets data for Chainlink
  async chainlinkAudy(): Promise<VLRNAVFeedResponseDto | null> {
    // Fetch the latest LiquidAssets record
    const latest = await this.liquidAssetsRepository.findOne({
      where: { isDeleted: false },
      order: { createDate: 'DESC' },
    });

    if (!latest) return null;

    // Format the response for Chainlink
    const response = new VLRNAVFeedResponseDto();
    response.accountName = 'VLR';
    response.NAV = latest.TotalAssetsValue ?? 0; // Use totalDailyLiquidAssets as NAV
    response.updatedAt = latest.createDate.toISOString();
    response.token = [
      {
        tokenName: 'VLR',
        totalTokenByChain: 0, //latest.totalWeeklyLiquidAssets ??// 0, // Use totalWeeklyLiquidAssets
      },
    ];

    return response;
  }
}
