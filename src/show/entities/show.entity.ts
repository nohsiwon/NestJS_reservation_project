import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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
  @IsNotEmpty({ message: '제목을 작성해주세요' })
  @Column('varchar', { length: 50, nullable: false, unique: true })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '설명을 작성해주세요' })
  @Column('varchar', { length: 1000, nullable: false })
  description: string;

  @IsNumber()
  @IsNotEmpty({ message: '좌석 수를 지정해주세요' })
  @Column('number', { select: false, nullable: false })
  seat: number;

  @IsNumber()
  @IsNotEmpty({ message: '가격을 작성해주세요' })
  @Column('number', { nullable: false })
  point: number;

  @IsArray()
  @IsNotEmpty({ message: '상영일을 작성해주세요' })
  @Column('array', { nullable: false })
  show_date: Array<Date>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
