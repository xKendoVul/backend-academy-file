import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { FilesModule } from './modules/files/files.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    FilesModule,
  ],
})
export class AppModule {}
