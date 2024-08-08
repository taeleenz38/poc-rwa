export class RedemptionCompletedResponse {
    user: string;
    redemptionId: string;
    amountRwaTokenBurned: number;
    collateralDuePostFees: number;
    price: number;
    dateTime?: string;
    priceId?: string;
}