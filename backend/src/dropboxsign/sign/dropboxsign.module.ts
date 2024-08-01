import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { Document } from 'src/repository/model/documents/document.entity';
import { User } from 'src/repository/model/user/user.entity';
import { DocumentRepoService } from 'src/repository/service/document.repo.service';
import { RepoServiceModule } from 'src/repository/service/reposervice.module';
import { UserDocumentRepoService } from 'src/repository/service/userdocument.repo.service';
import { DropBoxSignServiceController } from './dropboxsign.contoller';
import { DropBoxSignService } from './dropboxsign.service';

@Module({
    providers: [DropBoxSignService, UserDocumentRepoService, DocumentRepoService],
    controllers: [DropBoxSignServiceController],
    imports: [NestjsFormDataModule, TypeOrmModule.forFeature([User, Document]), RepoServiceModule],
    exports: [DropBoxSignModule]
})
export class DropBoxSignModule { }
