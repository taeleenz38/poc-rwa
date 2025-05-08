// src/file-upload/file-upload.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { SignedUrlResponseDto } from './dto/signed-url-response.dto';
import { FileUploadResponseDto } from './dto/file-upload-response.dto';
import { FundAttachmentRequestDto } from './dto/fund-attachment-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { NAVFeedResponseDto } from './dto/chainlink-eqv-response.dto';
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

  @Post('upload-xls-file')
  @UseInterceptors(FileInterceptor('fileStream')) // Interceptor to handle file upload
  async uploadXLSFile(
    @Body() fundAttachmentRequestDto: FundAttachmentRequestDto, // Other data from the body
    @UploadedFile() file: Express.Multer.File, // Correct type for Multer file upload
  ): Promise<FileUploadResponseDto> {
    // Here, `file.buffer` contains the uploaded file as a Buffer
    fundAttachmentRequestDto.fileStream = file.buffer;

    // Call the service to handle the uploaded CSV file
    const result = await this.fileUploadService.uploadXLSFile(
      fundAttachmentRequestDto,
    );
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

  @Get('chainlink/eqv')
  async chainlinkEqv(): Promise<NAVFeedResponseDto> {
    const navFeed = await this.fileUploadService.chainlinkEQV();

    if (!navFeed) {
      // Handle case where there's no NAV available, could throw or return empty DTO
      return {
        accountName: 'EQV',
        NAV: 0,
        updatedAt: new Date().toISOString(),
        token: [
          {
            tokenName: 'EQV',
            totalTokenByChain: 0,
          },
        ],
        ripcord: false,
        ripcordDetails: [],
      };
    }

    return navFeed;
  }
}
