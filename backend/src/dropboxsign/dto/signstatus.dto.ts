import { DocType } from "src/model/documents/document.entity";
import { DocumentStatus } from "src/model/documents/documentstatus.enum";

export class SginStatusDto {

    name: string;

    userEmail: string;

    userFirstName: string;

    userLastName: string;

    fileName: string;

    url: string;

    status: DocumentStatus;

    externalProvierDocStatus: string;

    type: DocType;
}