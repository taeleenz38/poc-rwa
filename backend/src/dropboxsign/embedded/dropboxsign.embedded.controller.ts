import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { SignRequestDto } from "../dto/signrequest.dto";
import { DropBoxEmbeddedSignService } from "./dropboxsign.embedded.service";

@Controller('/contract-sign-embd')
export class DropBoxSignEmbeddedController {

    constructor(private embeddedSignService: DropBoxEmbeddedSignService) { }

    @Post('/sign')
    public async signEmbedded(@Body() signRequest: SignRequestDto) {
        return await this.embeddedSignService.signEmbedded(signRequest);
    }

    @Get('/owner')
    public async getOwnerEmbeddedUrl(@Query('email') email: string) {
        return await this.embeddedSignService.getSignUrlForOwner(email);
    }
}