import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

export class CreateFileDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  model_id: number

  @IsNumber()
  @IsNotEmpty()
  user_id: number

  @IsNumber()
  @IsNotEmpty()
  user_updated_id: number

  @IsString()
  @IsNotEmpty()
  mime: string;

  @IsString()
  @IsNotEmpty()
  file_name: string;

  @IsDate()
  @IsOptional()
  created_at: Date;

  @IsDate()
  @IsOptional()
  updated_at: Date;
}

export class UpdateFileDto extends CreateFileDto { }