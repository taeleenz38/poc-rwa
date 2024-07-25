"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const crypto = require("crypto");
const FormData = require("form-data");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const SUMSUB_APP_TOKEN = 'sbx:Wll3qaMR0kyjw7NX7omsnR5K.fCmtkrFha7wjp1hzuQJZUBN1kDft5VFM';
const SUMSUB_SECRET_KEY = '5pr1ymYaiPQ6pKcBTcbTCxcEwZur7Oio';
const SUMSUB_BASE_URL = 'https://api.sumsub.com';
let AppService = class AppService {
    constructor(httpService) {
        this.httpService = httpService;
        this.httpService.axiosRef.interceptors.request.use(this.createSignature.bind(this));
    }
    createSignature(config) {
        const ts = Math.floor(Date.now() / 1000);
        const signature = crypto.createHmac('sha256', SUMSUB_SECRET_KEY);
        signature.update(ts + config.method.toUpperCase() + config.url);
        if (config.data instanceof FormData) {
            signature.update(config.data.getBuffer());
        }
        else if (config.data) {
            signature.update(config.data);
        }
        config.headers['X-App-Access-Ts'] = ts;
        config.headers['X-App-Access-Sig'] = signature.digest('hex');
        return config;
    }
    async createApplicant(externalUserId, levelName) {
        const url = `/resources/applicants?levelName=${encodeURIComponent(levelName)}`;
        const body = { externalUserId };
        const config = {
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
            const response = await (0, rxjs_1.lastValueFrom)((0, rxjs_1.from)(this.httpService.axiosRef(config)).pipe((0, operators_1.map)((res) => res.data)));
            return response;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data || error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async addDocument(applicantId, file, documentData) {
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
        const config = {
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
            const response = await (0, rxjs_1.lastValueFrom)((0, rxjs_1.from)(this.httpService.axiosRef(config)).pipe((0, operators_1.map)((res) => res.data)));
            return response;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data || error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getApplicantStatus(applicantId) {
        const url = `/resources/applicants/${applicantId}/status`;
        const config = {
            method: 'get',
            url,
            headers: {
                'Accept': 'application/json',
                'X-App-Token': SUMSUB_APP_TOKEN,
            },
            baseURL: SUMSUB_BASE_URL,
        };
        try {
            const response = await (0, rxjs_1.lastValueFrom)((0, rxjs_1.from)(this.httpService.axiosRef(config)).pipe((0, operators_1.map)((res) => res.data)));
            return response;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data || error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createAccessToken(externalUserId, levelName = 'basic-kyc-level', ttlInSecs = 600) {
        const url = `/resources/accessTokens?userId=${encodeURIComponent(externalUserId)}&ttlInSecs=${ttlInSecs}&levelName=${encodeURIComponent(levelName)}`;
        const config = {
            method: 'post',
            url,
            headers: {
                'Accept': 'application/json',
                'X-App-Token': SUMSUB_APP_TOKEN,
            },
            baseURL: SUMSUB_BASE_URL,
        };
        try {
            const response = await (0, rxjs_1.lastValueFrom)((0, rxjs_1.from)(this.httpService.axiosRef(config)).pipe((0, operators_1.map)((res) => res.data)));
            return response;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data || error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], AppService);
//# sourceMappingURL=app.service.js.map