// src/file-upload/file-upload.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { SignedUrlResponseDto } from './dto/signed-url-response.dto';
import { FileUploadResponseDto } from './dto/file-upload-response.dto';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Get('generate-signed-url/:fileName')
  async generateSignedUrl(
    @Param('fileName') fileName: string,
  ): Promise<SignedUrlResponseDto> {
    const result = await this.fileUploadService.generateSignedUrl(fileName);
    return result;
  }

  @Get('upload-csv-file/:id')
  async uploadCSVFile(@Param('id') id: number): Promise<FileUploadResponseDto> {
    const result = await this.fileUploadService.uploadCSVFile(id);
    return result;
  }

  @Get('list')
  async list(@Query('skip') skip: string, @Query('take') take: string) {
    const parsedSkip = parseInt(skip) || 0; // Default to 0 if no value is passed
    const parsedTake = parseInt(take) || 10; // Default to 10 if no value is passed

    const result = await this.fileUploadService.listFundAttachmentsPaginated(
      parsedSkip,
      parsedTake,
    );

    return {
      data: result.data,
      metadata: {
        totalCount: result.count,
        totalPages: result.totalPages,
        currentPage: Math.ceil(result.count / parsedTake),
        skip: parsedSkip,
        take: parsedTake,
      },
    };
  }
}
