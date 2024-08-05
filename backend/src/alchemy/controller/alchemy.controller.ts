import { Controller, Get } from '@nestjs/common';
import { AlchemyService } from '../service/alchemy.service';
import { PricingResponse } from '../dto/PricingResponse';
import { AllowListResponse } from '../dto/AllowListResponse';
import { AccountStatusResponse } from '../dto/AccountStatusResponse';
import { MintRequestedResponse } from '../dto/MIntRequestResponse';
import { ClaimableTimestampResponse } from '../dto/ClaimableTimestampResponse';
import { RedemptionRequestResponse } from '../dto/RedemptionRequestResponse';
import { ClaimableList } from '../dto/ClaimableList';
import { TransferResponse } from '../dto/TransferResponse';

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

  @Get("/pending-deposit-request-list")
  getMintRequestedList(): Promise<MintRequestedResponse[]> {
    return this.appService.getPendingDepositRequestList();
  }

  @Get("/claimable-timestamp-list")
  getClaimableTimestampList(): Promise<ClaimableTimestampResponse[]> {
    return this.appService.getClaimableTimestampList();
  }

  @Get("/pending-redemption-request-list")
  getPendingRedemptionList(): Promise<RedemptionRequestResponse[]> {
    return this.appService.getPendingRedemptionList();
  }

  @Get("/pending-approval-redemption-list")
  getPendingApprovalRedemptionList(): Promise<RedemptionRequestResponse[]> {
    return this.appService.getPendingApprovalRedemptionList();
  }

  @Get("/claimable-redemption-list")
  getClaimableRedemptionList(): Promise<RedemptionRequestResponse[]> {
    return this.appService.getClaimableRedemptionList();
  }

  @Get("/claimable-details")
  getClaimableDetails(): Promise<ClaimableList[]> {
    return this.appService.getClaimableDetails();
  }

  @Get("/test")
  test(): Promise<TransferResponse[]> {
    return this.appService.getTransferEvents();
  }
}
