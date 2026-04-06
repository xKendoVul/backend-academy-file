import { Module } from "@nestjs/common";
import { FilesController } from "./controllers/files.controller";
import { FilesService } from "./services/files.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [],
})

export class FilesModule { }