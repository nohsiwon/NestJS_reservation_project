import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import _ from 'lodash';
import { User } from 'src/user/entities/user.entity';
import { Show } from 'src/show/entities/show.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Show)
    private showRepository: Repository<Show>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async reserve(userId: number, showId: number) {
    const show = await this.showRepository.findOne({
      where: { show_id: showId },
      select: ['show_date', 'title', 'show_shop', 'point', 'seat'],
    });

    if (_.isNil(show)) {
      throw new BadRequestException('존재하지않는 공연 시간입니다');
    }

    if (show.seat === 0) {
      throw new ConflictException('남은 좌석이 없습니다');
    }

    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      select: ['point'],
    });

    if (user.point - show.point < 0) {
      throw new BadRequestException('보유 포인트가 부족합니다');
    }

    await this.userRepository.update(
      { user_id: userId },
      { point: user.point - show.point },
    );

    const existReservation = await this.reservationRepository.findOne({
      where: { show_id: showId },
    });

    if (_.isNil(existReservation)) {
      throw new ConflictException('이미 예약된 공연입니다');
    }

    await this.reservationRepository.save({
      user_id: userId,
      show_id: showId,
    });

    await this.showRepository.update(
      { show_id: showId },
      { seat: show.seat - 1 },
    );
    return {
      message: `${show.show_date[1]}시에 ${show.show_shop}에서 하는 ${show.title}를 ${show.point}로 예약하셨습니다`,
    };
  }

  async findAll(userId: number) {
    return await this.reservationRepository.find({
      where: { user_id: userId },
    });
  }

  async findOne(userId: number, showId: number) {
    const findReservation = await this.reservationRepository.findOne({
      where: { user_id: userId, show_id: showId },
    });

    if (_.isNil(findReservation)) {
      throw new NotFoundException('잘못된 공연번호입니다');
    }
    return findReservation;
  }

  async remove(userId: number, showId: number) {
    const findReservation = await this.reservationRepository.findOne({
      where: { user_id: userId, show_id: showId },
    });

    if (_.isNil(findReservation)) {
      throw new NotFoundException('잘못된 공연번호입니다');
    }

    await this.reservationRepository.softDelete({
      user_id: userId,
      show_id: showId,
    });

    const userPoint = await this.userRepository.findOne({
      where: { user_id: userId },
      select: ['point'],
    });
    const showPoint = await this.showRepository.findOne({
      where: { show_id: showId },
      select: ['point'],
    });

    await this.userRepository.update(
      { user_id: userId },
      { point: userPoint.point + showPoint.point },
    );

    return `예약 취소하셨습니다`;
  }
}
