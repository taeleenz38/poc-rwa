import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Document } from "../model/documents/document.entity";
import { User } from "../model/user/user.entity";
import { DocumentRepoService } from "./document.repo.service";
import { UserDocumentRepoService } from "./userdocument.repo.service";


@Module({
    exports: [DocumentRepoService, UserDocumentRepoService],
    providers: [DocumentRepoService, UserDocumentRepoService],
    imports: [TypeOrmModule.forFeature([User, Document])]
})
export class RepoServiceModule { }