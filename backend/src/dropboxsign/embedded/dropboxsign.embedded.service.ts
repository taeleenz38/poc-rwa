import * as DropboxSign from "@dropbox/sign";
import { Injectable, InternalServerErrorException, NotAcceptableException } from "@nestjs/common";
import * as fs from 'fs';
import { DocGenService } from "src/docgen/docgen.service";
import { DocumentStatus } from "src/repository/model/documents/documentstatus.enum";
import { DocumentRepoService } from "src/repository/service/document.repo.service";
import { UserDocument, UserDocumentRepoService } from "src/repository/service/userdocument.repo.service";
import * as tmp from 'tmp';
import { EmbeddedSignDataDto } from "../dto/embeddedsigndata.dto";
import { SignRequestDto } from "../dto/signrequest.dto";

type SignRequestResponse = {
    mainSignerId: string;
    ownerSignerId: string;
};
@Injectable()
export class DropBoxEmbeddedSignService {

    private signatureRequestApi = new DropboxSign.SignatureRequestApi();
    private embeddedApi = new DropboxSign.EmbeddedApi();

    constructor(private userDocRepoService: UserDocumentRepoService,
        private docService: DocumentRepoService, private docGenService: DocGenService) {
        this.signatureRequestApi.username = process.env.DROPBOX_SIGN_API_KEY;
        this.embeddedApi.username = process.env.DROPBOX_SIGN_API_KEY;
    }

    public async signEmbedded(signRequest: SignRequestDto): Promise<EmbeddedSignDataDto> {

        this.generatePDFToSign(signRequest)

        const doc = await this.docService.findDocByEmail(signRequest.email);
        if (process.env.SIGN_DOC_FILE_TEST_MODE === 'false' && doc.status === DocumentStatus.SIGN_COMPLETED) {
            throw new NotAcceptableException('The requested document has already been signed!');
        }

        const userDoc = await this.userDocRepoService.saveUserAndCreateDoc(signRequest);        

        // Create signer ids
        const sigId = await this.createSignerId(signRequest, userDoc);

        // Generate embedded sign url for main signer
        const mainSignerUrl = await this.generateEmbeddedSignUrls(sigId.mainSignerId);
        // const ownerSignerUrl = await this.generateEmbeddedSignUrls(sigId.ownerSignerId);

        const ret = new EmbeddedSignDataDto();

        ret.signUrl = mainSignerUrl;
        return ret;
    }

    public async getSignUrlForOwner(email: string) {
        const doc = await this.docService.findDocByEmail(email);
        const res = await this.generateEmbeddedSignUrls(doc.ownerSignatureId);
        const ret = new EmbeddedSignDataDto();
        ret.ownerSignUrl = res;
        return ret;
    }



    private async createSignerId(signRequest: SignRequestDto, userDoc: UserDocument): Promise<SignRequestResponse> {
    // /signature_request/create_embedded
        const signingOptions: DropboxSign.SubSigningOptions = {
            draw: true,
            type: true,
            upload: true,
            phone: false,
            defaultType: DropboxSign.SubSigningOptions.DefaultTypeEnum.Draw,
        };

        const user_x = parseInt(process.env.SIGN_DOC_SIGNER_USER_X);
        const user_y = parseInt(process.env.SIGN_DOC_SIGNER_USER_Y);
        const owner_x = parseInt(process.env.SIGN_DOC_SIGNER_OWNER_X);
        const owner_y = parseInt(process.env.SIGN_DOC_SIGNER_OWNER_Y);
        // Upload a local file
        const file = fs.createReadStream(await this.generatePDFToSign(signRequest));
        const data: DropboxSign.SignatureRequestCreateEmbeddedRequest = {
            clientId: process.env.DROPBOX_SIGN_CLIENT_ID,
            title: `${process.env.SIGN_DOC_NAME} - ${signRequest.firstName} ${signRequest.lastName}`,
            subject: process.env.SIGN_DOC_EMAIL_SUBJECT,
            message: process.env.SIGN_DOC_EMAIL_MESSAGE,
            signers: this.getSigners(signRequest),
            ccEmailAddresses: process.env.SIGN_DOC_CC_EMAILS ? process.env.SIGN_DOC_CC_EMAILS.split(',') : [],
            files: [file],
            metadata: {
                "user_id": userDoc.user.id,
                "doc_id": userDoc.document.id
            },
            signingOptions,
            testMode: Boolean(process.env.DROPBOX_SIGN_TEST_MODE),
            formFieldsPerDocument: [{
                documentIndex: 0, apiId: 'uniqueIdHere_3', signer: 0, type: 'signature',
                name: '', x: user_x, y: user_y, width: 120, height: 30, required: true, page: 3
            },
            {
                documentIndex: 0, apiId: 'uniqueIdHere_4', signer: 1, type: 'signature',
                name: '', x: owner_x, y: owner_y, width: 120, height: 30, required: true, page: 3
            }]
        };

        try {
            const response = await this.signatureRequestApi.signatureRequestCreateEmbedded(data);
            const doc = userDoc.document;
            doc.status = DocumentStatus.SENT;

            const body = response.body;
            if (body.signatureRequest && body.signatureRequest.signatures) {

                const signerRes: SignRequestResponse = {} as SignRequestResponse;
                // TODO: Implementation for multiple singatures
                for (let index = 0; index < body.signatureRequest.signatures.length; index++) {
                    const element = body.signatureRequest.signatures[index];

                    if (index === 0) {// TODO: Remove with implementation of multiple singatures
                        doc.signatureId = element.signatureId;    
                        signerRes.mainSignerId = element.signatureId;
                    } else {
                        signerRes.ownerSignerId = element.signatureId;
                        doc.ownerSignatureId = element.signatureId;
                        this.docService.saveDoc(doc);
                        return signerRes;
                    }
                }
            }
            return Promise.resolve(null);
        } catch (error) {
            console.log("Error occurred while creating signer id for embedded document signing!");
            console.log(error);
            throw new InternalServerErrorException(error, 'Error occurred while creating signer id for embedded document signing!');
        }
    }


    private async generateEmbeddedSignUrls(signatureId: string): Promise<string> {
        try {
            const response = await this.embeddedApi.embeddedSignUrl(signatureId);
            const embedded = response.body;
            return Promise.resolve(embedded.embedded.signUrl);
        } catch (error) {
            console.log('Error occurred while retrieving embedded url for document signing!');
            console.log(error);
            throw new InternalServerErrorException(error, 'Error occurred while retrieving embedded url for document signing!');
        };

    }

    private getSigners(signRequest: SignRequestDto,) {
        const signer1: DropboxSign.SubSignatureRequestSigner = {
            emailAddress: signRequest.email,
            name: signRequest.firstName + ' ' + signRequest.lastName,
            order: 0,
        };

        const signerOwner: DropboxSign.SubSignatureRequestSigner = {
            emailAddress: process.env.SIGN_DOC_SIGNER_OWNER_EMAIL,
            name: process.env.SIGN_DOC_SIGNER_OWNER_NAME,
            order: 1,
        };
        return [signer1, signerOwner];
    }

    private async generatePDFToSign(signRequest: SignRequestDto) {
        const userFulName = `${signRequest.firstName} ${signRequest.lastName}`;

        const buffer = await this.docGenService.generatePDF({
            date: (new Date()).toDateString(),
            signer_name: userFulName,
            signer_wallet_address: signRequest.walletAddress ? signRequest.walletAddress : '[NOT_PROVIDED]',
            main_signer: userFulName,
            owner_signer: process.env.SIGN_DOC_SIGNER_OWNER_NAME
        });
        const tempf = tmp.fileSync({ mode: 0o644, prefix: 'pocrwa-', postfix: '.pdf' });
        console.log('TEMP FIle: ' + tempf.name);
        await fs.writeFileSync(tempf.name, buffer);
        return tempf.name;
    }
}