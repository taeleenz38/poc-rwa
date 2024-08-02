import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DocType, Document } from "../model/documents/document.entity";


@Injectable()
export class DocumentRepoService {

    constructor(@InjectRepository(Document) private documentRepo: Repository<Document>) {
    }

    public async saveDoc(doc: Document): Promise<Document> {
        return this.documentRepo.save(doc);
    }

    public async findDocByEmail(email: string): Promise<Document> {
        return this.documentRepo.findOne({
            relations: { user: true },
            where: {
                user: {
                    email: email
                },
                type: DocType.AGREEMENT,
                fileName: process.env.SIGN_DOC_FILE
            },
        });
    }
}