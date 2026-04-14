import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { File } from "../entities/file.entity";
import { Repository } from "typeorm";
import { CreateFileDto, UpdateFileDto } from "../dto/file.dto";

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>
  ) { }

  getAll() {
    return `Endpoint para getAll`
  }

  async create(fileDto: CreateFileDto) {
    try {
      const file = this.fileRepo.create(fileDto);

      return await this.fileRepo.save(file)
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, fileDto: UpdateFileDto) {
    const file = await this.fileRepo.findOne({ where: { id } });

    if (!file) {
      throw new NotFoundException(`File con id ${id} no encontrado`);
    }

    try {
      this.fileRepo.merge(file, fileDto)
      await this.fileRepo.save(file)

      return {
        data: file,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async delete(id: number) {
    try {
      const exist = await this.fileRepo.existsBy({ id });
      if (!exist) {
        throw new NotFoundException(`Archivo con id ${id} no encontrado`)
      }
      await this.fileRepo.delete(id);
    } catch (error) {
      this.handleDBException(error)
    }
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.error(error);

    throw new InternalServerErrorException(
      'Error Inesperado, verifique los registros del servidor',
    )
  }
}