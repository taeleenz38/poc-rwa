import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { KycController } from "./verification.controller";
import { KycVerifcationService } from "./verification.service";

@Module({
    providers: [KycVerifcationService, HttpModule],
    controllers: [KycController],
    imports: [HttpModule],
    exports: [VerificationModule, KycVerifcationService]
})
export class VerificationModule { }