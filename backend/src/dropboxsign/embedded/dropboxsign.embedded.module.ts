import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NestjsFormDataModule } from "nestjs-form-data";
import { Document } from "src/repository/model/documents/document.entity";
import { User } from "src/repository/model/user/user.entity";
import { RepoServiceModule } from "src/repository/service/reposervice.module";
import { DropBoxSignEmbeddedController } from "./dropboxsign.embedded.controller";
import { DropBoxEmbeddedSignService } from "./dropboxsign.embedded.service";



@Module({
    providers: [DropBoxEmbeddedSignService],
    controllers: [DropBoxSignEmbeddedController],
    imports: [NestjsFormDataModule, TypeOrmModule.forFeature([User, Document]), RepoServiceModule]
})
export class DropBoxSignEmbeddedModule { }