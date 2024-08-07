export class MIntCompletedResponse {
    user: string;
    depositId: string;
    rwaOwed: number;
    depositAmountAfterFee: number;
    price: number;
    priceId: number;
    dateTime?: string;
}