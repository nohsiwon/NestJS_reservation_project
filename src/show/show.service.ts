import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Show) private showRepository: Repository<Show>,
  ) {}

  async create(createShowDto: CreateShowDto) {
    return (await this.showRepository.save(createShowDto)).showId;
  }

  async findAll() {
    return await this.showRepository.find({
      where: { deletedAt: null },
      select: ['showId', 'title', 'seat', 'point', 'show_date', 'updatedAt'],
    });
  }

  async findOne(id: number) {
    if (_.isNaN(id)) {
      throw new BadRequestException('공연 ID가 잘못되었습니다.');
    }

    return await this.showRepository.findOne({
      where: { showId: id, deletedAt: null },
      select: [
        'title',
        'description',
        'seat',
        'point',
        'show_date',
        'updatedAt',
      ],
    });
  }

  async update(id: number, updateShowDto: UpdateShowDto) {
    if (_.isNaN(id)) {
      throw new BadRequestException('공연 ID가 잘못되었습니다');
    }

    const { title, description, point, show_date } = updateShowDto;

    const show = await this.showRepository.findOne({
      select: ['seat'],
      where: { showId: id },
    });

    if (_.isNil(show)) {
      throw new NotFoundException('공연을 찾을 수 없습니다');
    }

    if (show.seat === 0) {
      throw new BadRequestException('남은 좌석이 없습니다');
    }

    await this.showRepository.update(
      { showId: id },
      { title, description, point, show_date },
    );
  }

  async remove(id: number) {
    if (_.isNaN(id)) {
      throw new BadRequestException('공연 ID가 잘못되었습니다');
    }

    const show = await this.showRepository.findOne({
      where: { showId: id },
    });

    if (_.isNil(show)) {
      throw new NotFoundException('공연을 찾을 수 없습니다');
    }

    return this.showRepository.softDelete({ showId: id });
  }
}
