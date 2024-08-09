import { IsEmail, IsNotEmpty } from "class-validator";

export class CredentialRequestDto {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}