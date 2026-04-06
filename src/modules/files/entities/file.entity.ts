import { ConstraintMetadata } from "class-validator/types/metadata/ConstraintMetadata";
import { StringifyOptions } from "querystring";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('files.file')
export class File {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ type: 'int4', nullable: false, length: 30 })
  model_id: number

  @Column({ type: 'int4', nullable: false, length: 30 })
  user_id: number

  @Column({ type: 'int4', nullable: false, length: 30 })
  user_updated_id: number

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'varchar', nullable: false })
  mime: string

  @Column({ type: 'varchar', nullable: false })
  file_name: string
}