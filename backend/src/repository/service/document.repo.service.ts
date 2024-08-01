import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Document } from "../model/documents/document.entity";


@Injectable()
export class DocumentRepoService {

    constructor(@InjectRepository(Document) private documentRepo: Repository<Document>) {
    }

    public async saveDoc(doc: Document): Promise<Document> {
        return this.documentRepo.save(doc);
    }
}