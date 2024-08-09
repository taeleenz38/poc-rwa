import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SignRequestDto } from "src/dropboxsign/dto/signrequest.dto";
import { Repository } from "typeorm";
import { DocType, Document } from "../model/documents/document.entity";
import { DocumentStatus } from "../model/documents/documentstatus.enum";
import { User } from "../model/user/user.entity";

export type UserDocument = {
    user: User;
    document: Document;
}

@Injectable()
export class UserDocumentRepoService {

    constructor(@InjectRepository(Document) private documentRepo: Repository<Document>,
        @InjectRepository(User) private userRepo: Repository<User>) {

    }

    public async saveUserAndCreateDoc(request: SignRequestDto): Promise<UserDocument> {
        const user = await this.userRepo.findOneBy({ email: request.email });

        var signer: User;
        if (user) {
            signer = user;
        } else {
            signer = this.userRepo.create();
        }

        signer.email = request.email;
        signer.firstName = request.firstName;
        signer.lastName = request.lastName;
        signer.country = request.country;
        signer.birthdate = request.birthdate;
        signer.idDocument = request.idDocument;
        signer.idNumber = request.idNumber;
        signer.idExpiry = request.idExpiry;

        const savedUser = await this.userRepo.save(signer);

        const doc = this.documentRepo.create();
        doc.name = process.env.SIGN_DOC_NAME;
        doc.status = DocumentStatus.NOT_SENT;
        doc.user = savedUser;
        doc.type = DocType.AGREEMENT;
        doc.fileName = process.env.SIGN_DOC_FILE;
        const savedDoc = await this.documentRepo.save(doc);

        return Promise.resolve({ user: savedUser, document: savedDoc });
    }
}