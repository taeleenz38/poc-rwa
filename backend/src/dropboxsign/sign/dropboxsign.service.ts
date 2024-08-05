import * as DropboxSign from "@dropbox/sign";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from 'fs';
import { DocType, Document } from "src/repository/model/documents/document.entity";
import { DocumentStatus } from "src/repository/model/documents/documentstatus.enum";
import { User } from "src/repository/model/user/user.entity";
import { DocumentRepoService } from "src/repository/service/document.repo.service";
import { Repository } from "typeorm";
import { DownloadDocumentDto } from "../dto/downloaddocument.dto";
import { SignRequestDto } from "../dto/signrequest.dto";
import { SginStatusDto } from "../dto/signstatus.dto";

@Injectable()
export class DropBoxSignService {

    private signatureRequestApi = new DropboxSign.SignatureRequestApi();

    constructor(@InjectRepository(Document) private documentRepo: Repository<Document>,
        @InjectRepository(User) private userRepo: Repository<User>, private docRepoService: DocumentRepoService) {
        this.signatureRequestApi.username = process.env.DROPBOX_SIGN_API_KEY;
    }

    async sendSignRequest(request: SignRequestDto) {
        try {
            const signer1: DropboxSign.SubSignatureRequestSigner = {
                emailAddress: request.email,
                name: request.firstName + ' ' + request.lastName,
                order: 0,
            };

            const signingOptions: DropboxSign.SubSigningOptions = {
                draw: true,
                type: true,
                upload: true,
                phone: false,
                defaultType: DropboxSign.SubSigningOptions.DefaultTypeEnum.Draw,
            };

            const user = await this.userRepo.findOneBy({ email: request.email });

            var signer;
            if (user) {
                signer = user;
            } else {
                signer = this.userRepo.create();
            }

            signer.email = request.email;
            signer.firstName = request.firstName;
            signer.lastName = request.lastName;
            const savedUser = await this.userRepo.save(signer);

            const doc = this.documentRepo.create();
            doc.name = process.env.SIGN_DOC_NAME;
            doc.status = DocumentStatus.NOT_SENT;
            doc.user = savedUser;
            doc.type = DocType.AGREEMENT;
            doc.fileName = process.env.SIGN_DOC_FILE;
            const savedDoc = await this.documentRepo.save(doc);

            // Upload a local file
            const file = fs.createReadStream(process.env.SIGN_DOC_FILE);
            const data: DropboxSign.SignatureRequestSendRequest = {
                title: `${process.env.SIGN_DOC_NAME} - ${request.firstName} ${request.lastName}`,
                subject: process.env.SIGN_DOC_EMAIL_SUBJECT,
                message: process.env.SIGN_DOC_EMAIL_MESSAGE,
                signers: [signer1],
                ccEmailAddresses: process.env.SIGN_DOC_CC_EMAILS ? process.env.SIGN_DOC_CC_EMAILS.split(',') : [],
                files: [file],
                metadata: {
                    "user_id": savedUser.id,
                    "doc_id": savedDoc.id
                },
                signingOptions,
                testMode: Boolean(process.env.DROPBOX_SIGN_TEST_MODE),
            };
            const result = this.signatureRequestApi.signatureRequestSend(data);
            result.then(response => {
                doc.status = DocumentStatus.SENT;
                this.documentRepo.save(doc);
                console.log(response.body);
                return response.body;
            }).catch(error => {
                console.log("Exception when calling Dropbox Sign API:");
                console.log(error.body);
            });
        } catch (error) {
            console.log(`Error occurred while sending the sign request! --> Email: ${request.email}`)
            console.error(error)
        }
        return {};
    }

    /**
     * updateStatusCallback
     */
    async updateStatusCallback(data: any) {
        try {
            const callback_event = DropboxSign.EventCallbackRequest.init(JSON.parse(data.json));
            console.log(callback_event)

            // verify that a callback came from HelloSign.com
            if (DropboxSign.EventCallbackHelper.isValid(process.env.DROPBOX_SIGN_API_KEY, callback_event)) {
                // one of "account_callback" or "api_app_callback"
                const callback_type = DropboxSign.EventCallbackHelper.getCallbackType(callback_event);

                if (callback_event && callback_event.signatureRequest) {
                    // Get the signer email
                    for (const e of callback_event.signatureRequest.signatures) {
                        const doc = await this.documentRepo.findOne({
                            relations: { user: true },
                            where: {
                                user: {
                                    email: e.signerEmailAddress
                                },
                                type: DocType.AGREEMENT,
                                fileName: process.env.SIGN_DOC_FILE
                            },
                        });

                        if (doc) {
                            doc.xid = callback_event.signatureRequest.signatureRequestId;
                            doc.url = callback_event.signatureRequest.filesUrl;
                            doc.status = callback_event.signatureRequest.isComplete ?
                                DocumentStatus.SIGN_COMPLETED : callback_event.signatureRequest.isDeclined ?
                                    DocumentStatus.SIGN_DECLINED : DocumentStatus.SIGN_PENDING;
                            doc.externalProvierDocStatus = e.statusCode;
                            doc.save();
                        }
                    }
                }
            }
        } catch (error) {
            console.log(`Error occurred while updating callback status from Dropbox Sign Webhook service! \n --> DATA: ${data}`)
            console.error(error)
        }
        return {};
    }

    public async getSignStatus(email: string): Promise<SginStatusDto> {
        const doc = await this.documentRepo.findOne({
            relations: { user: true },
            where: {
                user: {
                    email: email
                }
            }
        });
        if (doc) {
            const dto = new SginStatusDto();

            dto.name = doc.name;
            dto.fileName = doc.fileName;
            dto.userFirstName = doc.user.firstName;
            dto.userLastName = doc.user.lastName;
            dto.status = doc.status;
            dto.externalProvierDocStatus = doc.externalProvierDocStatus;
            dto.userEmail = doc.user.email;
            dto.url = doc.url;
            return Promise.resolve(dto);
        }
        throw new NotFoundException('Requested Document is not found!')
    }

    public async downloadSignedDocumentLink(email: string): Promise<DownloadDocumentDto> {
        const doc = await this.docRepoService.findDocByEmail(email);
        try {
            const result = await this.signatureRequestApi.signatureRequestFilesAsFileUrl(doc.xid);
            const dto = new DownloadDocumentDto();
            dto.downloadUrl = result.body.fileUrl;
            return Promise.resolve(dto);
        } catch (error) {
            console.error(error)
            console.error('Error occurred while requesting the download url! Email: ' + email);
            throw new InternalServerErrorException('Error occurred while requesting the download url! Email: ' + email);
        }
    }
}