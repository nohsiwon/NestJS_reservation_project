import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ShowCategory } from '../types/showCategory.type';

@Entity({
  name: 'show',
})
export class Show {
  @PrimaryGeneratedColumn()
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
  @Column('int', { select: false, nullable: false })
  seat: number;

  @IsNumber()
  @IsNotEmpty({ message: '가격을 작성해주세요' })
  @Column('int', { nullable: false })
  point: number;

  @IsString()
  @IsNotEmpty({ message: '공연 장소를 작성해주세요' })
  @Column('varchar', { nullable: false })
  showShop: string;

  @IsString()
  @IsNotEmpty({ message: '예약일, 예약 시간을 작성해주세요' })
  @Column('varchar', {
    nullable: false,
  })
  showDate: string;

  @Column('varchar', { nullable: true })
  showImage: string; // 파일 경로나 이미지 URL을 저장

  @Column({
    type: 'enum',
    enum: ShowCategory,
    default: ShowCategory.other,
  })
  showCategory: ShowCategory;

  @OneToMany(() => Reservation, (reservation) => reservation.show)
  reservations: Reservation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
