export class MintRequestedResponse {
    user: string;
    depositId: string;
    collateralAmountDeposited: string;
    depositAmountAfterFee: string;
    feeAmount: string;
    priceId?: string;
    claimableTimestamp?: string;
    status?: string;
    price?: string;
    requestTimestamp?: string;
}
