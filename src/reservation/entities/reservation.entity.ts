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
  reservationId: number;

  @ManyToOne(() => User, (user) => user.reservation)
  @JoinColumn()
  user: User;

  @Column({ type: 'bigint' })
  userId: number;

  @ManyToOne(() => Show, (show) => show.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  show: Show;

  @Column({ type: 'bigint' })
  showId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
