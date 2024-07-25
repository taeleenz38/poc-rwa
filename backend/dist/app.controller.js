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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const platform_express_1 = require("@nestjs/platform-express");
const document_dto_1 = require("./document.dto");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    async createApplicant(externalUserId, levelName) {
        return this.appService.createApplicant(externalUserId, levelName);
    }
    async addDocument(applicantId, file, createDocumentDto) {
        return this.appService.addDocument(applicantId, file, createDocumentDto);
    }
    async getApplicantStatus(applicantId) {
        return this.appService.getApplicantStatus(applicantId);
    }
    async createAccessToken(externalUserId, levelName, ttlInSecs) {
        return this.appService.createAccessToken(externalUserId, levelName, ttlInSecs);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)('create-applicant'),
    __param(0, (0, common_1.Body)('externalUserId')),
    __param(1, (0, common_1.Body)('levelName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createApplicant", null);
__decorate([
    (0, common_1.Post)('applicants/:id/documents'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, document_dto_1.DocumentDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "addDocument", null);
__decorate([
    (0, common_1.Post)('get-status/:applicantId'),
    __param(0, (0, common_1.Param)('applicantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getApplicantStatus", null);
__decorate([
    (0, common_1.Post)('create-access-token'),
    __param(0, (0, common_1.Body)('externalUserId')),
    __param(1, (0, common_1.Body)('levelName')),
    __param(2, (0, common_1.Body)('ttlInSecs')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createAccessToken", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('sumsub'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map