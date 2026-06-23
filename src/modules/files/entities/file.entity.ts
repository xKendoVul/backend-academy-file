import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum FileModelType {
  ESTUDIANTE = 'estudiante',
  DOCENTE = 'docente',
}

export enum FileType {
  FOTO_PERFIL = 'foto_perfil',
  DOCUMENTO = 'documento',
}

@Entity('files.file')
export class File {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: FileModelType, nullable: false })
  model_type: FileModelType;

  @Column({ type: 'integer', nullable: false })
  model_id: number;

  @Column({ type: 'enum', enum: FileType, nullable: false })
  file_type: FileType;

  @Column({ type: 'varchar', nullable: false, length: 255 })
  original_name: string;

  @Column({ type: 'varchar', nullable: false, length: 255 })
  file_name: string;

  @Column({ type: 'varchar', nullable: false, length: 500 })
  file_path: string;

  @Column({ type: 'varchar', nullable: false, length: 100 })
  mime: string;

  @Column({ type: 'integer', nullable: false })
  size: number;

  @Column({ type: 'integer', nullable: false })
  user_updated_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
