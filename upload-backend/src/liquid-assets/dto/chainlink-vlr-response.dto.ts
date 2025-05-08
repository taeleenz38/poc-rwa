export class TokenDetails {
  tokenName: string;
  totalTokenByChain: number;
}

export class VLRNAVFeedResponseDto {
  accountName: string = 'VLR';
  NAV: number;
  updatedAt: string;
  token: TokenDetails[] = [];
  ripcord: boolean = false;
  ripcordDetails: any[] = [];
}
