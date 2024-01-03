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
import { Like, Repository } from 'typeorm';
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

    await this.showRepository.save(createShowDto);
    return `${createShowDto} 공연을 성공적으로 추가하였습니다`;
  }

  async findAll() {
    return await this.showRepository.find({
      where: { deletedAt: null },
      select: ['show_id', 'title', 'seat', 'point', 'show_date', 'updatedAt'],
    });
  }

  async findOne(id: number) {
    if (_.isNaN(id)) {
      throw new NotFoundException('공연 ID가 잘못되었습니다.');
    }

    const findOneShow = await this.showRepository.findOne({
      where: { show_id: id, deletedAt: null },
      select: [
        'title',
        'description',
        'seat',
        'point',
        'show_date',
        'updatedAt',
      ],
    });

    if (findOneShow.seat === 0) {
      throw new BadRequestException('남은 좌석이 없습니다');
    }

    return findOneShow;
  }

  async findByTitle(title: string) {
    const searchResults = await this.showRepository.find({
      where: {
        deletedAt: null,
        title: Like(`%${title}%`), // title에 특정 문자열을 포함하는 경우
      },
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
      show_shop,
      show_date,
      show_image,
      // show_category,
    } = updateShowDto;

    const show = await this.showRepository.findOne({
      where: { show_id: id },
    });

    if (_.isNil(show)) {
      throw new NotFoundException('공연을 찾을 수 없습니다');
    }

    await this.showRepository.update(
      { show_id: id },
      {
        title,
        description,
        point,
        show_shop,
        show_date,
        show_image,
        // show_category,
      },
    );

    return `공연 정보가 수정되었습니다`;
  }

  async remove(id: number) {
    if (_.isNaN(id)) {
      throw new NotFoundException('공연 ID가 잘못되었습니다');
    }

    const show = await this.showRepository.findOne({
      where: { show_id: id },
    });

    if (_.isNil(show)) {
      throw new NotFoundException('공연을 찾을 수 없습니다');
    }

    return this.showRepository.softDelete({ show_id: id });
  }
}
