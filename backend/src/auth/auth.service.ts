import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { UserRepoService } from "src/repository/service/user.repo.service";
import { AuthResponseDto } from "./dto/auth.response.dto";
import { CredentialRequestDto } from "./dto/credential.request.dto";
import { SigninRequestDto } from "./dto/signin.request.dto";
import { UserProfileDto } from "./dto/userprofile.dto";

@Injectable()
export class AuthService {

    private SALT = process.env.SIGNUP_GEN_PASSWORD_HASHING_SALT;
    constructor(private userRepoService: UserRepoService,
        private jwtService: JwtService
    ) {
        if (!this.SALT) {
            throw new Error('Startup error! User password salt has not been configured!');
        }
    }

    public async signup(request: CredentialRequestDto) {
        const user = await this.userRepoService.findUser(request.email);

        if (user) {
            user.password = await this.getHashedPassword(request.password);
            user.save();
        } else {
            throw new NotFoundException('User not found! Please onboard the user before setting the password!')
        }
    }


    public async signin(request: SigninRequestDto): Promise<AuthResponseDto> {
        const user = await this.userRepoService.findUser(request.email);
        if (user && user.password === await this.getHashedPassword(request.password)) {
            const payload = { sub: user.id, username: user.email };
            const jwt = await this.jwtService.signAsync(payload, { secret: process.env.AUTH_JWT_SECRET, expiresIn: process.env.AUTH_JWT_EXPIRES });
            const res = new AuthResponseDto();
            res.email = user.email;
            res.token = jwt;
            return res;
        } else {
            throw new UnauthorizedException('User has not been authenticated!');
        }
    }

    async getProfile(email: string): Promise<UserProfileDto> {
        const user = await this.userRepoService.findUser(email);
        const res = new UserProfileDto();
        res.email = user.email;
        res.firstName = user.firstName;
        res.lastName = user.lastName;
        res.birthdate = user.birthdate;
        res.idDocument = user.idDocument;
        res.idNumber = user.idNumber;
        res.idExpiry = user.idExpiry;
        res.walletAddress = user.walletAddress;
        res.country = user.country;
        return res;
    }



    private async getHashedPassword(password: string) {
        return await bcrypt.hash(password, this.SALT);
    }
}