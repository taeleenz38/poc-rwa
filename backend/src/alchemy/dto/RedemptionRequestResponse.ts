export class RedemptionRequestResponse {
    user: string;
    redemptionId: string;
    rwaAmountIn: string;
    priceId?: string;
    requestTimestamp?: string;
    price?: string;
    requestedRedeemAmount?: string;
    requestedRedeemAmountAfterFee?: string;
    feeAmount?: string;
    status?: string;
}
