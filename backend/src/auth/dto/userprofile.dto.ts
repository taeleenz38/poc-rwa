import { Transform } from "class-transformer";
import { format } from "date-fns";


export class UserProfileDto {

    email: string;

    firstName: string;

    lastName: string;

    walletAddress: string;

    country: string;

    @Transform(({ value }) => format(value, process.env.RESPONSE_OBJ_FORMAT_DATE), { toClassOnly: true })
    birthdate: Date;

    idDocument: string;

    idNumber: string;

    @Transform(({ value }) => format(value, process.env.RESPONSE_OBJ_FORMAT_DATE), { toClassOnly: true })
    idExpiry: Date;

    isActive: boolean;

    verificationId: string;
}