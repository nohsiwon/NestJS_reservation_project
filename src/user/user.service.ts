import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { NotFoundError } from 'rxjs';
import _ from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email, deletedAt: null },
      select: ['userId', 'password'],
    });

    if (_.isNil(user)) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
  }

  async signUp(createUserDto: CreateUserDto) {
    const existUser = await this.findOne(createUserDto.email);

    if (!_.isNil(existUser)) {
      throw new ConflictException('이미 가입된 아이디입니다');
    }

    return await this.userRepository.save(createUserDto);
  }

  profile(userPayload: any) {
    return `유저 정보: ${JSON.stringify(userPayload)}`;
  }

  private async findOne(email: string) {
    return await this.userRepository.findOne({
      where: { email, deletedAt: null },
      select: ['email', 'createdAt', 'updatedAt'],
    });
  }
}
