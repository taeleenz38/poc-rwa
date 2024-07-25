import { Controller, Post, Param, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentDto } from './document.dto';

@Controller('sumsub')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create-applicant')
  async createApplicant(@Body('externalUserId') externalUserId: string, @Body('levelName') levelName: string) {
    return this.appService.createApplicant(externalUserId, levelName);
  }

  @Post('applicants/:id/documents')
  @UseInterceptors(FileInterceptor('file'))
  async addDocument(
    @Param('id') applicantId: string,
    @UploadedFile() file: { buffer: Buffer; originalname: string },
    @Body() createDocumentDto: DocumentDto,
  ) {
    return this.appService.addDocument(applicantId, file, createDocumentDto);
  }

  @Post('get-status/:applicantId')
  async getApplicantStatus(@Param('applicantId') applicantId: string) {
    return this.appService.getApplicantStatus(applicantId);
  }

  @Post('create-access-token')
  async createAccessToken(@Body('externalUserId') externalUserId: string, @Body('levelName') levelName: string, @Body('ttlInSecs') ttlInSecs: number) {
    return this.appService.createAccessToken(externalUserId, levelName, ttlInSecs);
  }
}
