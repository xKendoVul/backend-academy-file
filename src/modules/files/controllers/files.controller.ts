import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FilesService } from "../services/files.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('files')
export class FilesController {
  constructor(private readonly FileService: FilesService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}