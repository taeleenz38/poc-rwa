import { DocType } from "src/repository/model/documents/document.entity";
import { DocumentStatus } from "src/repository/model/documents/documentstatus.enum";

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