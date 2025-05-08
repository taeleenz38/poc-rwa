// dto/fund-attachment.dto.ts
export class FundAttachmentResponseDto {
  id: number;
  fileName: string;
  actualFileName: string;
  createDate: Date;
  updateDate: Date;
  isDeleted: boolean;
  attachmentId: number;
  signedUrl: string; // Read-only signed URL
  NavValue: number | null;
}
