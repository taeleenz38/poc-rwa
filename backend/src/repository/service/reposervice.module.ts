import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Document } from "../model/documents/document.entity";
import { User } from "../model/user/user.entity";
import { DocumentRepoService } from "./document.repo.service";
import { UserRepoService } from "./user.repo.service";
import { UserDocumentRepoService } from "./userdocument.repo.service";


@Module({
    exports: [DocumentRepoService, UserDocumentRepoService, UserRepoService],
    providers: [DocumentRepoService, UserDocumentRepoService, UserRepoService],
    imports: [TypeOrmModule.forFeature([User, Document])]
})
export class RepoServiceModule { }