import {
  BadRequestException,
  ConflictException,
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
    const existShow = await this.showRepository.findOne({
      where: { title: createShowDto.title },
    });

    if (!_.isNil(existShow)) {
      throw new ConflictException('이미 존재하는 상영입니다');
    }

    if (createShowDto.point < 0 || createShowDto.point > 50000) {
      throw new BadRequestException('가격이 알맞지 않습니다');
    }

    await this.showRepository.save(createShowDto);
    return {
      createShowDto,
    };
  }

  async findAll() {
    return await this.showRepository.find({
      where: { deletedAt: null },
      select: [
        'showId',
        'title',
        'seat',
        'point',
        'showShop',
        'showDate',
        'updatedAt',
      ],
    });
  }

  async findOne(id: number) {
    if (_.isNaN(id)) {
      throw new NotFoundException('공연 ID가 잘못되었습니다.');
    }

    const findOneShow = await this.showRepository.findOne({
      where: { showId: id, deletedAt: null },
      select: [
        'title',
        'description',
        'seat',
        'point',
        'showShop',
        'showDate',
        'updatedAt',
      ],
    });

    if (findOneShow.seat === 0) {
      throw new BadRequestException('남은 좌석이 없습니다');
    }

    return findOneShow;
  }

  async findByTitle(title: string) {
    const allShow = await this.showRepository.find({
      where: { deletedAt: null },
    });

    const searchResults = allShow.filter((show) => {
      return show.title.includes(title);
    });

    return searchResults;
  }

  async update(id: number, updateShowDto: UpdateShowDto) {
    if (_.isNaN(id)) {
      throw new NotFoundException('공연 ID가 잘못되었습니다');
    }

    const {
      title,
      description,
      point,
      showShop,
      showDate,
      showImage,
      showCategory,
    } = updateShowDto;

    const show = await this.showRepository.findOne({
      where: { showId: id },
    });

    if (_.isNil(show)) {
      throw new NotFoundException('공연을 찾을 수 없습니다');
    }

    await this.showRepository.update(
      { showId: id },
      {
        title,
        description,
        point,
        showShop,
        showDate,
        showImage,
        showCategory,
      },
    );

    return `공연 정보가 수정되었습니다`;
  }

  async remove(id: number) {
    if (_.isNaN(id)) {
      throw new NotFoundException('공연 ID가 잘못되었습니다');
    }

    const show = await this.showRepository.findOne({
      where: { showId: id },
    });

    if (_.isNil(show)) {
      throw new NotFoundException('공연을 찾을 수 없습니다');
    }

    this.showRepository.softDelete({ showId: id });

    return `공연 정보가 삭제되었습니다`;
  }
}
