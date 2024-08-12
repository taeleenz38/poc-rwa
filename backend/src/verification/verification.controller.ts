import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentDto } from '../dto/request/document.dto';
import { ApplicantResponse, ReviewResponse } from '../dto/response/response.dto';
import { KycVerifcationService } from './verification.service';

@Controller('kyc')
export class KycController {
  constructor(private readonly appService: KycVerifcationService) { }

  @Post('applicant')
  async createApplicant(): Promise<ApplicantResponse> {
    return await this.appService.createApplicant();
  }

  @Post('applicants/:id/documents')
  @UseInterceptors(FileInterceptor('file'))
  async addDocument(
    @Param('id') applicantId: string,
    @UploadedFile() file: { buffer: Buffer; originalname: string },
    @Body() createDocumentDto: DocumentDto,
  ): Promise<any> {
    return await this.appService.addDocument(applicantId, file, createDocumentDto);
  }

  @Get('status/:applicantId')
  async getApplicantStatus(@Param('applicantId') applicantId: string): Promise<ReviewResponse> {
    return await this.appService.getApplicantStatus(applicantId);
  }

  @Post('access-token')
  async createAccessToken(@Body('externalUserId') externalUserId: string, @Body('levelName') levelName: string, @Body('ttlInSecs') ttlInSecs: number) {
    return this.appService.createAccessToken(externalUserId, levelName, ttlInSecs);
  }
}
