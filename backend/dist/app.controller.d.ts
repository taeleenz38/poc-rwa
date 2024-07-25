import { AppService } from './app.service';
import { DocumentDto } from './document.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    createApplicant(externalUserId: string, levelName: string): Promise<any>;
    addDocument(applicantId: string, file: {
        buffer: Buffer;
        originalname: string;
    }, createDocumentDto: DocumentDto): Promise<any>;
    getApplicantStatus(applicantId: string): Promise<any>;
    createAccessToken(externalUserId: string, levelName: string, ttlInSecs: number): Promise<any>;
}
