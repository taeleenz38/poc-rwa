import * as DropboxSign from "@dropbox/sign";
import { Injectable, InternalServerErrorException, NotAcceptableException } from "@nestjs/common";
import * as fs from 'fs';
import { DocumentStatus } from "src/repository/model/documents/documentstatus.enum";
import { DocumentRepoService } from "src/repository/service/document.repo.service";
import { UserDocument, UserDocumentRepoService } from "src/repository/service/userdocument.repo.service";
import { EmbeddedSignDataDto } from "../dto/embeddedsigndata.dto";
import { SignRequestDto } from "../dto/signrequest.dto";


@Injectable()
export class DropBoxEmbeddedSignService {

    private signatureRequestApi = new DropboxSign.SignatureRequestApi();
    private embeddedApi = new DropboxSign.EmbeddedApi();

    constructor(private userDocRepoService: UserDocumentRepoService,
        private docService: DocumentRepoService) {
        this.signatureRequestApi.username = process.env.DROPBOX_SIGN_API_KEY;
        this.embeddedApi.username = process.env.DROPBOX_SIGN_API_KEY;
    }

    public async signEmbedded(signRequest: SignRequestDto): Promise<EmbeddedSignDataDto> {

        const doc = await this.docService.findDocByEmail(signRequest.email);
        if (process.env.SIGN_DOC_FILE_TEST_MODE === 'false' && doc.status === DocumentStatus.SIGN_COMPLETED) {
            throw new NotAcceptableException('The requested document has already been signed!');
        }

        const userDoc = await this.userDocRepoService.saveUserAndCreateDoc(signRequest);        

        // Create signer ids
        const sigId = await this.createSignerId(signRequest, userDoc);

        // Generate embedded sign url
        return await this.generateEmbeddedSignUrls(sigId, userDoc);
    }



    private async createSignerId(signRequest: SignRequestDto, userDoc: UserDocument): Promise<string> {
        // /signature_request/create_embedded


        const signer1: DropboxSign.SubSignatureRequestSigner = {
            emailAddress: signRequest.email,
            name: signRequest.firstName + ' ' + signRequest.lastName,
            order: 0,
        };

        const signingOptions: DropboxSign.SubSigningOptions = {
            draw: true,
            type: true,
            upload: true,
            phone: false,
            defaultType: DropboxSign.SubSigningOptions.DefaultTypeEnum.Draw,
        };

        // Upload a local file
        const file = fs.createReadStream(process.env.SIGN_DOC_FILE);
        const data: DropboxSign.SignatureRequestCreateEmbeddedRequest = {
            clientId: process.env.DROPBOX_SIGN_CLIENT_ID,
            title: `${process.env.SIGN_DOC_NAME} - ${signRequest.firstName} ${signRequest.lastName}`,
            subject: process.env.SIGN_DOC_EMAIL_SUBJECT,
            message: process.env.SIGN_DOC_EMAIL_MESSAGE,
            signers: [signer1],
            ccEmailAddresses: process.env.SIGN_DOC_CC_EMAILS ? process.env.SIGN_DOC_CC_EMAILS.split(',') : [],
            files: [file],
            metadata: {
                "user_id": userDoc.user.id,
                "doc_id": userDoc.document.id
            },
            signingOptions,
            testMode: Boolean(process.env.DROPBOX_SIGN_TEST_MODE),
        };

        try {
            const response = await this.signatureRequestApi.signatureRequestCreateEmbedded(data);
            const doc = userDoc.document;
            doc.status = DocumentStatus.SENT;

            const body = response.body;
            if (body.signatureRequest && body.signatureRequest.signatures) {

                // TODO: Implementation for multiple singatures
                for (let index = 0; index < body.signatureRequest.signatures.length; index++) {
                    const element = body.signatureRequest.signatures[index];

                    if (index === 0) {// TODO: Remove with implementation of multiple singatures
                        doc.signatureId = element.signatureId;
                        this.docService.saveDoc(doc);
                        return Promise.resolve(element.signatureId);
                    }
                }
            }

            console.log("$$$$$$$$$$$ " + JSON.stringify(response.body));
            return Promise.resolve(null);
        } catch (error) {
            console.log("Error occurred while creating signer id for embedded document signing!");
            console.log(error);
            throw new InternalServerErrorException(error, 'Error occurred while creating signer id for embedded document signing!');
        }
    }


    private async generateEmbeddedSignUrls(signatureId: string, userDoc: UserDocument): Promise<EmbeddedSignDataDto> {
        const response = await this.embeddedApi.embeddedSignUrl(signatureId);
        try {
            const embedded = response.body;
            const dto = new EmbeddedSignDataDto();
            dto.signUrl = embedded.embedded.signUrl;
            // dto.expiresAt = new Date(embedded.embedded.expiresAt);
            userDoc.document.url = embedded.embedded.signUrl;
            userDoc.document.save();
            return Promise.resolve(dto);
        } catch (error) {
            console.log('Error occurred while retrieving embedded url for document signing!');
            console.log(error);
            throw new InternalServerErrorException(error, 'Error occurred while retrieving embedded url for document signing!');
        };

    }
}