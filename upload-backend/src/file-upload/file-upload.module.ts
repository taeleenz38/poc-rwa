//src/file-upload/file-upload.module.ts
import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';

import { Attachments } from './entities/attachments.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundAttachments } from './entities/fund-attachments.entity';
import { FileUploadController } from './file-upload.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Attachments, FundAttachments])],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService], // Export the service to make it reusable in other modules
})
export class FileUploadModule {}
