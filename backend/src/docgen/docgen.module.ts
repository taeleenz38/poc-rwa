import { Module } from "@nestjs/common";
import { DocGenService } from "./docgen.service";


@Module({
    providers: [DocGenService],
    exports: [DocGenService, DocGenModule]
})
export class DocGenModule { }