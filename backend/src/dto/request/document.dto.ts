import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class DocumentDto {
  @IsString()
  @IsNotEmpty()
  idDocType: string;

  @IsString()
  @IsNotEmpty()
  country: string; // ISO 3166-1 alpha-3 country code

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  issuedDate: string; // Format YYYY-mm-dd

  @IsDateString()
  @IsNotEmpty()
  validUntil: string; // Format YYYY-mm-dd

  @IsString()
  @IsNotEmpty()
  number: string; // Document number

  @IsDateString()
  @IsNotEmpty()
  dob: string; // Applicant date of birth (Format YYYY-mm-dd)

  @IsString()
  @IsOptional()
  placeOfBirth?: string; // Applicant place of birth

  @IsString()
  @IsNotEmpty()
  idDocSubType: String // FRONT_SIDE, BACK_SIDE or null, if document has only one side 
}
