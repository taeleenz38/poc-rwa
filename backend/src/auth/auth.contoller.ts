import { Body, Controller, Get, Patch, Post, Query } from "@nestjs/common";
import { instanceToInstance } from "class-transformer";
import { AuthService } from "./auth.service";
import { CredentialRequestDto, } from "./dto/credential.request.dto";
import { SigninRequestDto } from "./dto/signin.request.dto";

@Controller('/auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Patch('/credential')
    public signup(@Body() data: CredentialRequestDto) {
        return this.authService.signup(data);
    }

    @Post('/signin')
    public signin(@Body() data: SigninRequestDto) {
        return this.authService.signin(data);
    }

    @Get('/profile')
    public getProfile(@Query('email') email: string) {
        return instanceToInstance(this.authService.getProfile(email));
    }

    @Get('/status')
    public getProfileStatus(@Query('email') email: string) {
        return this.authService.getProfileStatus(email);
    }
}