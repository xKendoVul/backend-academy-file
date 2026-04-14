import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FilesService } from "../services/files.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller('files')
export class FilesController {
  constructor(private readonly FileService: FilesService) { }

  @Post('upload')
  // @MessagePattern({ cmd: 'upload_file'})
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.file) {
    console.log(file);
  }
}