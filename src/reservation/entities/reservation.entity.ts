import { Show } from 'src/show/entities/show.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'reservations',
})
export class Reservation {
  @PrimaryGeneratedColumn()
  reservationId: number;

  @ManyToOne(()=>User,)
  @JoinColumn({name:''})

}
