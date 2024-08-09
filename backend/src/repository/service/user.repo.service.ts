import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../model/user/user.entity";

@Injectable()
export class UserRepoService {

    constructor(@InjectRepository(User) private userRepo: Repository<User>) {
    }

    public async findUser(email: string) {
        return await this.userRepo.findOneBy({ email: email });
    }

}