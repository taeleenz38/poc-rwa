import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlchemyController } from './alchemy/controller/alchemy.controller';
import { AlchemyService } from './alchemy/service/alchemy.service';
import { AuthModule } from './auth/auth.module';
import { DropBoxSignEmbeddedModule } from './dropboxsign/embedded/dropboxsign.embedded.module';
import { DropBoxSignModule } from './dropboxsign/sign/dropboxsign.module';
import { Document } from './repository/model/documents/document.entity';
import { User } from './repository/model/user/user.entity';
import { VerificationModule } from './verification/verification.module';
import { KycVerifcationService } from './verification/verification.service';


@Module({
  imports: [DropBoxSignModule, DropBoxSignEmbeddedModule, AuthModule, VerificationModule, HttpModule, ConfigModule.forRoot({
    envFilePath: '/app/dist/config/.env',
  }), TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    logging: false,
    entities: [User, Document],
  }),],
  controllers: [AlchemyController],
  providers: [KycVerifcationService, AlchemyService],
})
export class AppModule {}
