import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import _ from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string) {
    const existUser = await this.findOne(email);

    if (!_.isNil(existUser)) {
      throw new ConflictException('이미 가입된 아이디입니다');
    }

    const hashedPassword = await hash(password, 10);

    await this.userRepository.save({
      email,
      password: hashedPassword,
    });
  }

  async signIn(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email, deletedAt: null },
      select: ['userId', 'email', 'password'],
    });

    if (_.isNil(user)) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const payload = { userId: user.userId, email };

    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: { email, deletedAt: null },
    });
  }
}
