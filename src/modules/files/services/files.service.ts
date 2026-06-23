import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File, FileModelType, FileType } from '../entities/file.entity';
import { Repository, FindOptionsWhere, QueryFailedError } from 'typeorm';
import { CreateFileDto, UpdateFileDto, FileQueryDto } from '../dto/file.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
  ) {
    void this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.promises.access(this.uploadDir);
    } catch {
      await fs.promises.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async create(fileDto: CreateFileDto): Promise<File> {
    try {
      const file = this.fileRepo.create(fileDto);
      return await this.fileRepo.save(file);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(): Promise<File[]> {
    return this.fileRepo.find();
  }

  async findOne(id: number): Promise<File> {
    const file = await this.fileRepo.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException(`File con id ${id} no encontrado`);
    }
    return file;
  }

  async findByModel(query: FileQueryDto): Promise<File[]> {
    const where: FindOptionsWhere<File> = {
      model_type: query.model_type,
      model_id: query.model_id,
    };
    if (query.file_type) {
      where.file_type = query.file_type;
    }
    return this.fileRepo.find({ where });
  }

  async update(id: number, fileDto: UpdateFileDto): Promise<File> {
    const file = await this.findOne(id);
    try {
      this.fileRepo.merge(file, fileDto);
      return await this.fileRepo.save(file);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async delete(id: number): Promise<void> {
    const file = await this.findOne(id);
    try {
      try {
        await fs.promises.access(file.file_path);
        await fs.promises.unlink(file.file_path);
      } catch {
        // File already removed from disk, continue with DB delete
      }
      await this.fileRepo.delete(id);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async deleteByModel(
    model_type: FileModelType,
    model_id: number,
    file_type?: FileType,
  ): Promise<{ deleted: number }> {
    const where: FindOptionsWhere<File> = { model_type, model_id };
    if (file_type) {
      where.file_type = file_type;
    }
    const files = await this.fileRepo.find({ where });
    await Promise.all(
      files.map(async (file) => {
        try {
          await fs.promises.access(file.file_path);
          await fs.promises.unlink(file.file_path);
        } catch {
          // File already removed from disk
        }
      }),
    );
    await this.fileRepo.delete(files.map((f) => f.id));
    return { deleted: files.length };
  }

  private handleDBException(error: unknown): never {
    if (error instanceof QueryFailedError) {
      const driverError = error.driverError as {
        code?: string;
        detail?: string;
        message?: string;
      };
      if (driverError.code === '23505') {
        throw new BadRequestException(driverError.detail);
      }
      console.error(error);
      throw new InternalServerErrorException(
        `Error de base de datos: ${driverError.code || 'unknown'} - ${driverError.message || driverError.detail || 'verifique los registros del servidor'}`,
      );
    }
    console.error(error);
    throw new InternalServerErrorException(
      'Error inesperado - verifique los registros del servidor',
    );
  }
}
