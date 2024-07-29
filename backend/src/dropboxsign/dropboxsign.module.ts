import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { Document } from 'src/model/documents/document.entity';
import { User } from 'src/model/user/user.entity';
import { DropBoxSignServiceController } from './dropboxsign.contoller';
import { DropBoxSignService } from './dropboxsign.service';

@Module({
    providers: [DropBoxSignService],
    controllers: [DropBoxSignServiceController],
    imports: [NestjsFormDataModule, TypeOrmModule.forFeature([User, Document])]
})
export class DropboxsignModule { }
