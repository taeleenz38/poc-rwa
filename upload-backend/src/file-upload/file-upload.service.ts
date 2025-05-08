import { InternalServerErrorException } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { SignedUrlResponseDto } from './dto/signed-url-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachments } from './entities/attachments.entity';
import { FileUploadResponseDto } from './dto/file-upload-response.dto';
import { FundAttachments } from './entities/fund-attachments.entity';
import { FundAttachmentResponseDto } from './dto/fund-attachment-response.dto';
import { FundAttachmentRequestDto } from './dto/fund-attachment-request.dto';
import * as XLSX from 'xlsx';
import { NAVFeedResponseDto } from './dto/chainlink-eqv-response.dto';

export class FileUploadService {
  private storage: Storage;
  private bucketName: string;
  private keyFile: string;

  constructor(
    @InjectRepository(Attachments)
    private attachmentRepository: Repository<Attachments>,
    @InjectRepository(FundAttachments)
    private fundAttachmentRepository: Repository<FundAttachments>,
    private configService: ConfigService,
  ) {
    // Read the environment variables
    this.bucketName = this.configService.get<string>('GCP_BUCKET_NAME');
    this.keyFile = this.configService.get<string>('GCP_KEYFILE');

    // Initialize Google Cloud Storage with the service account key file
    this.storage = new Storage({
      keyFilename: this.keyFile,
      projectId: this.configService.get<string>('GCP_PROJECT_ID'),
    });
  }
  async generateSignedUrl(fileName: string): Promise<SignedUrlResponseDto> {
    // Create a GUID for the file name
    const uniqueFileName = `${uuidv4()}-${fileName}`;

    // Define the subdirectory (can be customized based on business needs)
    const subdirectory = 'uploads'; // You can replace this with logic to create subdirectories (e.g., by category, user ID)
    const filePath = `${subdirectory}/${uniqueFileName}`;

    const options = {
      version: 'v4' as const,
      action: 'write' as const,
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes expiration
      contentType: 'application/vnd.ms-excel', // Must match exactly
    };

    try {
      const [url] = await this.storage
        .bucket(this.bucketName)
        .file(filePath)
        .getSignedUrl(options);

      const newAttachment = new Attachments();
      newAttachment.fileName = uniqueFileName;
      newAttachment.actualFileName = fileName;
      newAttachment.filePath = filePath;
      newAttachment.createDate = new Date();
      newAttachment.updateDate = new Date();
      newAttachment.isDeleted = false;

      const attachment = await this.createAttachment(newAttachment);
      return { url, attachmentId: attachment.id };
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new InternalServerErrorException('Could not generate signed URL');
    }
  }

  async uploadXLSFile(
    fundAttachmentRequestDto: FundAttachmentRequestDto,
  ): Promise<FileUploadResponseDto> {
    try {
      const id = fundAttachmentRequestDto.attachmentId;
      const mainAttachment = await this.attachmentRepository.findOne({
        where: { id },
      });

      const result = this.extractNetAssetsSmart(
        fundAttachmentRequestDto.fileStream,
      );

      const newFundAttachment = new FundAttachments();
      newFundAttachment.fileName = mainAttachment.fileName;
      newFundAttachment.actualFileName = mainAttachment.actualFileName;
      newFundAttachment.createDate = new Date();
      newFundAttachment.updateDate = new Date();
      newFundAttachment.isDeleted = false;
      newFundAttachment.attachmentId = mainAttachment.id;

      if (
        'netAssetsValue' in result &&
        typeof result.netAssetsValue === 'number'
      ) {
        newFundAttachment.NavValue = result.netAssetsValue;
      } else {
        newFundAttachment.NavValue = 0;
      }

      await this.createFundAttachment(newFundAttachment);
      return { result: true };
    } catch (error) {
      console.error('Error uploading XLS file:', error);
      throw new InternalServerErrorException('Could not upload XLS file');
    }
  }

  async listFundAttachmentsPaginated(skip = 0, take = 10) {
    const [data, count] = await this.fundAttachmentRepository.findAndCount({
      order: { createDate: 'DESC' },
      skip,
      take,
    });

    const result = await Promise.all(
      data.map(async (attachment) => {
        // Generate the signed URL for the attachment's file
        const signedUrl = await this.generateReadOnlySignedUrl(
          attachment.fileName,
        );

        return this.mapToDto(attachment, signedUrl);
      }),
    );

    return {
      data: result,
      count,
      totalPages: Math.ceil(count / take),
    };
  }

  async findOne(id: number): Promise<Attachments> {
    return this.attachmentRepository.findOne({ where: { id } });
  }

  async createAttachment(
    attachment: Partial<Attachments>,
  ): Promise<Attachments> {
    const newAttachment = this.attachmentRepository.create(attachment);
    return this.attachmentRepository.save(newAttachment);
  }

  async createFundAttachment(
    fundAttachment: Partial<FundAttachments>,
  ): Promise<FundAttachments> {
    const newFundAttachment =
      this.fundAttachmentRepository.create(fundAttachment);
    return this.fundAttachmentRepository.save(newFundAttachment);
  }

  async generateReadOnlySignedUrl(fileName: string): Promise<string> {
    try {
      const options = {
        version: 'v4' as const, // Explicitly cast to the 'v4' literal type
        action: 'read' as const, // Explicitly cast to the 'read' literal type
        expires: Date.now() + 15 * 60 * 1000,
      };

      const gcpFilePath = `uploads/${fileName}`;

      // Generate the signed URL
      const [url] = await this.storage
        .bucket(this.bucketName)
        .file(gcpFilePath)
        .getSignedUrl(options);

      return url; // Return the URL
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  private mapToDto(
    attachment: FundAttachments,
    signedUrl: string,
  ): FundAttachmentResponseDto {
    return {
      id: attachment.id,
      fileName: attachment.fileName,
      actualFileName: attachment.actualFileName,
      createDate: attachment.createDate,
      updateDate: attachment.updateDate,
      isDeleted: attachment.isDeleted,
      attachmentId: attachment.attachmentId,
      signedUrl, // Include the signed URL
      NavValue: attachment.NavValue,
    };
  }

  extractNetAssetsSmart(buffer: Buffer):
    | {
        netAssetsValue: number;
        raw: string;
        row: any[];
        rowIndex: number;
        colIndex: number;
      }
    | { message: string } {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });

    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      const row = data[rowIndex];
      if (!Array.isArray(row)) continue;

      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const cell = row[colIndex];
        if (
          typeof cell === 'string' &&
          cell.toLowerCase().includes('net assets')
        ) {
          // Search the rest of the row for the first numeric value
          for (let j = colIndex + 1; j < row.length; j++) {
            const value = row[j];
            if (
              value !== undefined &&
              value !== null &&
              !isNaN(parseFloat(String(value).replace(/,/g, '')))
            ) {
              const raw = String(value);
              const netAssetsValue = parseFloat(raw.replace(/,/g, ''));

              return {
                raw,
                netAssetsValue,
                row,
                rowIndex,
                colIndex,
              };
            }
          }
        }
      }
    }

    return { message: 'Net Assets found, but no numeric value beside it.' };
  }

  async chainlinkEQV(): Promise<NAVFeedResponseDto | null> {
    const latest = await this.fundAttachmentRepository.findOne({
      where: { isDeleted: false },
      order: { createDate: 'DESC' },
    });

    if (!latest) return null;

    const response = new NAVFeedResponseDto();
    response.NAV = latest.NavValue ?? 0;
    response.updatedAt = latest.createDate.toISOString();
    response.token = [
      {
        tokenName: 'EQV',
        totalTokenByChain: 0,
      },
    ];

    return response;
  }
}
