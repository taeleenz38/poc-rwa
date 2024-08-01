import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { Document } from 'src/repository/model/documents/document.entity';
import { User } from 'src/repository/model/user/user.entity';
import { UserDocumentRepoService } from 'src/repository/service/userdocument.repo.service';
import { DropBoxSignServiceController } from './dropboxsign.contoller';
import { DropBoxSignService } from './dropboxsign.service';

@Module({
    providers: [DropBoxSignService, UserDocumentRepoService],
    controllers: [DropBoxSignServiceController],
    imports: [NestjsFormDataModule, TypeOrmModule.forFeature([User, Document])],
    exports: [DropBoxSignModule]
})
export class DropBoxSignModule { }
