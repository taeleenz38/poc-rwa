export class MintRequestedResponse {
    user: string;
    depositId: string;
    collateralAmountDeposited: string;
    depositAmountAfterFee: string;
    feeAmount: string;
    priceId?: string;
    dateTime?: string;
}
