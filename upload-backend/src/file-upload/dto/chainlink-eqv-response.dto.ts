export class TokenDetails {
  tokenName: string;
  totalTokenByChain: number;
}

export class NAVFeedResponseDto {
  accountName: string = 'EQV';
  NAV: number;
  updatedAt: string;
  token: TokenDetails[] = [];
  ripcord: boolean = false;
  ripcordDetails: any[] = [];
}
