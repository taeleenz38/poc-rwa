// dto/fund-attachment-row.dto.ts
export class FundAttachmentRowDto {
  tokenID: string;
  maxSupply: number;
  totalUser: number;
  createDate: string;
  updateDate: string;
  NAV: number;

  constructor(
    tokenID: string,
    maxSupply: number,
    totalUser: number,
    createDate: string,
    updateDate: string,
    NAV: number,
  ) {
    this.tokenID = tokenID;
    this.maxSupply = maxSupply;
    this.totalUser = totalUser;
    this.createDate = createDate;
    this.updateDate = updateDate;
    this.NAV = NAV;
  }
}
