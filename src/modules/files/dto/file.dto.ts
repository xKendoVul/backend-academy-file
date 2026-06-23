import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FileModelType, FileType } from '../entities/file.entity';

export class CreateFileDto {
  @IsEnum(FileModelType)
  @IsNotEmpty()
  model_type: FileModelType;

  @IsNumber()
  @IsNotEmpty()
  model_id: number;

  @IsEnum(FileType)
  @IsNotEmpty()
  file_type: FileType;

  @IsString()
  @IsNotEmpty()
  original_name: string;

  @IsString()
  @IsNotEmpty()
  file_name: string;

  @IsString()
  @IsNotEmpty()
  file_path: string;

  @IsString()
  @IsNotEmpty()
  mime: string;

  @IsNumber()
  @IsNotEmpty()
  size: number;

  @IsNumber()
  @IsNotEmpty()
  user_updated_id: number;
}

export class UpdateFileDto {
  @IsEnum(FileModelType)
  @IsOptional()
  model_type?: FileModelType;

  @IsNumber()
  @IsOptional()
  model_id?: number;

  @IsEnum(FileType)
  @IsOptional()
  file_type?: FileType;

  @IsString()
  @IsOptional()
  original_name?: string;

  @IsString()
  @IsOptional()
  file_name?: string;

  @IsString()
  @IsOptional()
  file_path?: string;

  @IsString()
  @IsOptional()
  mime?: string;

  @IsNumber()
  @IsOptional()
  size?: number;

  @IsNumber()
  @IsOptional()
  user_updated_id?: number;
}

export class FileQueryDto {
  @IsEnum(FileModelType)
  @IsNotEmpty()
  model_type: FileModelType;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  model_id: number;

  @IsEnum(FileType)
  @IsOptional()
  file_type?: FileType;
}
