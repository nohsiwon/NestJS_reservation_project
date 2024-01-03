import { IsArray, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'show',
})
export class Show {
  @PrimaryColumn()
  showId: number;

  @IsString()
  @Column('varchar', { length: 50, nullable: false })
  title: string;

  @IsString()
  @Column('varchar', { length: 1000, nullable: false })
  description: string;

  @IsNumber()
  @Column('number', { select: false, nullable: false })
  seat: number;

  @IsNumber()
  @Column('number', { nullable: false })
  point: number;

  @IsArray()
  @Column('array', { nullable: false })
  show_date: Array<Date>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
