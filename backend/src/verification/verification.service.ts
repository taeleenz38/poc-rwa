// src/sumsub/sumsub.service.ts
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import * as crypto from 'crypto';
import * as FormData from 'form-data';
import { from, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentDto } from '../dto/request/document.dto';
import { ApplicantResponse, ReviewResponse } from '../dto/response/response.dto';

const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN;
const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY;
const SUMSUB_BASE_URL = process.env.SUMSUB_BASE_URL;
const verficationLevel = process.env.verficationLevel;

@Injectable()
export class KycVerifcationService {
  constructor(private readonly httpService: HttpService) {
    this.httpService.axiosRef.interceptors.request.use(this.createSignature.bind(this));
  }

  private createSignature(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const ts = Math.floor(Date.now() / 1000);
    const signature = crypto.createHmac('sha256', SUMSUB_SECRET_KEY);
    signature.update(ts + config.method.toUpperCase() + config.url);

    if (config.data instanceof FormData) {
      signature.update(config.data.getBuffer());
    } else if (config.data) {
      signature.update(config.data);
    }

    config.headers['X-App-Access-Ts'] = ts;
    config.headers['X-App-Access-Sig'] = signature.digest('hex');

    return config;
  }

  async createApplicant(): Promise<ApplicantResponse> {
    const url = `/resources/applicants?levelName=${encodeURIComponent(verficationLevel)}`;
    const externalUserId = Date.now();
    const body = { externalUserId };

    const config: AxiosRequestConfig = {
      method: 'post',
      url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-App-Token': SUMSUB_APP_TOKEN,
      },
      data: JSON.stringify(body),
      baseURL: SUMSUB_BASE_URL,
    };

    try {
      const response = await lastValueFrom(
        from(this.httpService.axiosRef(config)).pipe(
          map((res: AxiosResponse) => res.data),
        ),
      );
      return new ApplicantResponse(response.id);
    } catch (error) {
      throw new HttpException(error.response?.data || error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async addDocument(applicantId: string, file: { buffer: Buffer; originalname: string }, documentData: DocumentDto): Promise<any> {
    const url = `/resources/applicants/${applicantId}/info/idDoc`;
    const metadata = {
      idDocType: documentData.idDocType,
      idDocSubType: documentData.idDocSubType,
      country: documentData.country,
      firstName: documentData.firstName,
      middleName: documentData.middleName,
      lastName: documentData.lastName,
      issuedDate: documentData.issuedDate,
      validUntil: documentData.validUntil,
      number: documentData.number,
      dob: documentData.dob,
      placeOfBirth: documentData.placeOfBirth
    };
    const form = new FormData();

    form.append('metadata', JSON.stringify(metadata));
    form.append('content', file.buffer, file.originalname);

    const config: AxiosRequestConfig = {
      method: 'post',
      url,
      headers: {
        'Accept': 'application/json',
        'X-App-Token': SUMSUB_APP_TOKEN,
        ...form.getHeaders(),
      },
      data: form,
      baseURL: SUMSUB_BASE_URL,
    };

    try {
      const response = await lastValueFrom(
        from(this.httpService.axiosRef(config)).pipe(
          map((res: AxiosResponse) => res.data),
        ),
      );
      return response;
    } catch (error) {
      throw new HttpException(error.response?.data || error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getApplicantStatus(applicantId: string): Promise<ReviewResponse> {
    const url = `/resources/applicants/${applicantId}/status`;

    const config: AxiosRequestConfig = {
      method: 'get',
      url,
      headers: {
        'Accept': 'application/json',
        'X-App-Token': SUMSUB_APP_TOKEN,
      },
      baseURL: SUMSUB_BASE_URL,
    };

    try {
      const response = await lastValueFrom(
        from(this.httpService.axiosRef(config)).pipe(
          map((res: AxiosResponse) => res.data),
        ),
      );

      return new ReviewResponse(response.reviewStatus, response.reviewResult?.reviewAnswer);
    } catch (error) {
      throw new HttpException(error.response?.data || error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createAccessToken(externalUserId: string, levelName = 'basic-kyc-level', ttlInSecs = 600): Promise<any> {
    const url = `/resources/accessTokens?userId=${encodeURIComponent(externalUserId)}&ttlInSecs=${ttlInSecs}&levelName=${encodeURIComponent(levelName)}`;

    const config: AxiosRequestConfig = {
      method: 'post',
      url,
      headers: {
        'Accept': 'application/json',
        'X-App-Token': SUMSUB_APP_TOKEN,
      },
      baseURL: SUMSUB_BASE_URL,
    };

    try {
      const response = await lastValueFrom(
        from(this.httpService.axiosRef(config)).pipe(
          map((res: AxiosResponse) => res.data),
        ),
      );
      return response;
    } catch (error) {
      throw new HttpException(error.response?.data || error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
