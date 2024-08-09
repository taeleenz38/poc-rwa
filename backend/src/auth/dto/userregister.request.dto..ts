import { IsBoolean, IsEmail, IsNotEmpty, ValidateIf } from "class-validator";

export class UserRegisterRequestDto {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsBoolean()
    isGeneratedPassword: boolean;

    @ValidateIf(e => e.isGeneratedPassword === false)
    @IsNotEmpty()
    password: string;
}