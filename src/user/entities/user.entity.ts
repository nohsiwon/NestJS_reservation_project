import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../types/userType.type';
import { Reservation } from 'src/reservation/entities/reservation.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요' })
  @Column('varchar', { unique: true, nullable: false })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  @Column('varchar', { select: false, nullable: false })
  password: string;

  @IsNumber()
  @Column('int', { nullable: false, default: 1000000 })
  point: number;

  @Column('enum', { enum: UserType, default: UserType.User })
  userType: UserType;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservation: Reservation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
