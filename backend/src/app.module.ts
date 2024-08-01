import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlchemyController } from './alchemy/controller/alchemy.controller';
import { AlchemyService } from './alchemy/service/alchemy.service';
import { DropBoxSignModule } from './dropboxsign/email/dropboxsign.module';
import { DropBoxSignEmbeddedModule } from './dropboxsign/embedded/dropboxsign.embedded.module';
import { Document } from './repository/model/documents/document.entity';
import { User } from './repository/model/user/user.entity';
import { AppController } from './verification/verification.controller';
import { KycVerifcationService } from './verification/verification.service';


@Module({
  imports: [HttpModule, DropBoxSignModule, DropBoxSignEmbeddedModule, ConfigModule.forRoot({
    envFilePath: 'config/.env',
  }), TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'db/database.db',
    synchronize: true,
    logging: false,
    entities: [User, Document],
  }),],
  controllers: [AppController, AlchemyController],
  providers: [KycVerifcationService, AlchemyService],
})
export class AppModule {}
