import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../types/userType.type';

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
  @Column('varchar', { nullable: false, default: 1000000 })
  point: number;

  @Column('enum', { enum: UserType, default: UserType.User })
  user_type: UserType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
