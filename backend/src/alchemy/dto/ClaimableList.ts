export class ClaimableList {
    user: string;
    depositId: string;
    collateralAmountDeposited: string;
    depositAmountAfterFee: string;
    feeAmount: string;
    claimTimestamp?: string;
    claimTimestampFromChain?: number;
    priceId: string;
    claimableAmount?: number
}
