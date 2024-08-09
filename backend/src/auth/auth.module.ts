import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/repository/model/user/user.entity";
import { RepoServiceModule } from "src/repository/service/reposervice.module";
import { AuthController } from "./auth.contoller";
import { AuthService } from "./auth.service";

@Module({
    imports: [RepoServiceModule,
        JwtModule.register({
            global: true,
            secret: process.env.AUTH_JWT_SECRET,
            signOptions: { expiresIn: process.env.AUTH_JWT_EXPIRES },
        }),
        TypeOrmModule.forFeature([User])
    ],
    providers: [AuthService, JwtService],
    controllers: [AuthController],
    exports: [AuthModule]
})
export class AuthModule { }