import { IsEmail, IsNotEmpty } from "class-validator";

export class SignRequestDto {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    walletAddress: string;

    country: string;

    birthdate: Date;

    idDocument: string;

    idNumber: string;

    idExpiry: Date;

    verificationId: string;

}