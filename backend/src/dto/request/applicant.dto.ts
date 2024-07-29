import { IsNotEmpty, IsString } from "class-validator";

export class ApplicantDto {
    @IsString()
    @IsNotEmpty()
    externalUserId: string;
    
    @IsString()
    @IsNotEmpty()
    levelName: string
}