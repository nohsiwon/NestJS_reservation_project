import { Show } from 'src/show/entities/show.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'reservations',
})
export class Reservation {
  @PrimaryGeneratedColumn()
  reservation_id: number;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
