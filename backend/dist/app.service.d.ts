import { HttpService } from '@nestjs/axios';
import { DocumentDto } from './document.dto';
export declare class AppService {
    private readonly httpService;
    constructor(httpService: HttpService);
    private createSignature;
    createApplicant(externalUserId: string, levelName: string): Promise<any>;
    addDocument(applicantId: string, file: {
        buffer: Buffer;
        originalname: string;
    }, documentData: DocumentDto): Promise<any>;
    getApplicantStatus(applicantId: string): Promise<any>;
    createAccessToken(externalUserId: string, levelName?: string, ttlInSecs?: number): Promise<any>;
}
