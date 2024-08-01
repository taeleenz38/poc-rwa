import { Body, Controller, Get, Post, Query, Req, Res } from "@nestjs/common";
import { Request } from "express";
import { FormDataRequest } from "nestjs-form-data";
import { SignRequestDto } from "../dto/signrequest.dto";
import { DropBoxSignService } from "./dropboxsign.service";

@Controller('/contract-sign')
export class DropBoxSignServiceController {

    constructor(private signService: DropBoxSignService) { }

    /**
     * sendSignRequest
     */
    @Post('/send')
    public sendSignRequest(@Body() signRequest: SignRequestDto) {
        return this.signService.sendSignRequest(signRequest);
    }

    @Post('/callback')
    @FormDataRequest()
    public callBack(@Req() data: Request, @Res() res: Response, @Body() body: any) {
        this.signService.updateStatusCallback(body);
    }

    @Get('/status')
    public getStatus(@Query('email') email: string) {
        return this.signService.getSignStatus(email);
    }

    @Get('/download/link')
    public getSignedDocument(@Query('email') email: string) {
        return this.signService.downloadSignedDocumentLink(email);
    }
}