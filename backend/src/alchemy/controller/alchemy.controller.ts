import { Controller, Get } from '@nestjs/common';
import { AlchemyService } from '../service/alchemy.service';
import { PricingResponse } from '../dto/PricingResponse';
import { AllowListResponse } from '../dto/AllowListResponse';
import { AccountStatusResponse } from '../dto/AccountStatusResponse';
import { MintRequestedResponse } from '../dto/MIntRequestResponse';
import { ClaimableTimestampResponse } from '../dto/ClaimableTimestampResponse';
import { RedemptionRequestResponse } from '../dto/RedemptionRequestResponse';

@Controller()
export class AlchemyController {
  constructor(private readonly appService: AlchemyService) { }

  @Get("/price-list")
  getPriceList(): Promise<PricingResponse[]> {
    return this.appService.getPricing();
  }

  @Get("/term-index-list")
  getTermIndexList(): Promise<AllowListResponse[]> {
    return this.appService.getTermIndexList();
  }

  @Get("/account-status")
  getAccountStatusList(): Promise<AccountStatusResponse[]> {
    return this.appService.getAccountStatus();
  }

  @Get("/mint-requested-list")
  getMintRequestedList(): Promise<MintRequestedResponse[]> {
    return this.appService.getMintList();
  }

  @Get("/claimable-timestamp-list")
  getClaimableTimestampList(): Promise<ClaimableTimestampResponse[]> {
    return this.appService.getClaimableTimestampList();
  }

  @Get("/redemption-requested-list")
  getRedemptionRequestedList(): Promise<RedemptionRequestResponse[]> {
    return this.appService.getRedemptionRequestedList();
  }
}
