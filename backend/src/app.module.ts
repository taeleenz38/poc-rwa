import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DropboxsignModule } from './dropboxsign/dropboxsign.module';
import { Document } from './model/documents/document.entity';
import { User } from './model/user/user.entity';
import { KycVerifcationService } from './verification/verification.service';
import { AppController } from './verification/verification.controller';
import { AlchemyController } from './alchemy/controller/alchemy.controller';
import { AlchemyService } from './alchemy/service/alchemy.service';


@Module({
  imports: [HttpModule, DropboxsignModule, ConfigModule.forRoot({
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
