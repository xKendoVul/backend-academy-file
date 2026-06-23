import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FilesService } from '../services/files.service';
import { CreateFileDto, UpdateFileDto, FileQueryDto } from '../dto/file.dto';
import { FileModelType, FileType } from '../entities/file.entity';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const fileDto: CreateFileDto = {
      model_type: body.model_type as FileModelType,
      model_id: parseInt(body.model_id),
      file_type: body.file_type as FileType,
      original_name: file.originalname,
      file_name: file.filename,
      file_path: file.path,
      mime: file.mimetype,
      size: file.size,
      user_updated_id: parseInt(body.user_updated_id) || 0,
    };
    return this.filesService.create(fileDto);
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get('model')
  findByModel(@Query() query: FileQueryDto) {
    return this.filesService.findByModel(query);
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Delete('model/:modelType/:modelId')
  deleteByModel(
    @Param('modelType') modelType: string,
    @Param('modelId', ParseIntPipe) modelId: number,
    @Query('file_type') fileType?: string,
  ) {
    return this.filesService.deleteByModel(
      modelType as FileModelType,
      modelId,
      fileType as FileType,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFileDto: UpdateFileDto,
  ) {
    return this.filesService.update(id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.delete(id);
  }
}
