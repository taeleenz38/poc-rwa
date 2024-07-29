import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DropboxsignModule } from './dropboxsign/dropboxsign.module';
import { Document } from './model/documents/document.entity';
import { User } from './model/user/user.entity';

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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
