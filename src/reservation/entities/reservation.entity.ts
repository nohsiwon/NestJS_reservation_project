import { IsNotEmpty, IsString } from 'class-validator';
import { Show } from 'src/show/entities/show.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'reservations',
})
export class Reservation {
  @PrimaryGeneratedColumn()
  reservation_id: number;

  @IsString()
  @IsNotEmpty({ message: '예약일, 예약 시간을 작성해주세요' })
  @Column('varchar', {
    nullable: false,
  })
  show_date: string;

  @ManyToOne(() => User, (user) => user.reservation)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'bigint', name: 'user_id' })
  user_id: number;

  @ManyToOne(() => Show, (show) => show.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'show_id' })
  show: Show;

  @Column({ type: 'bigint', name: 'show_id' })
  show_id: number;
}
