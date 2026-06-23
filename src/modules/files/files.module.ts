import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FilesController } from './controllers/files.controller';
import { FilesService } from './services/files.service';
import { File } from './entities/file.entity';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/static',
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}