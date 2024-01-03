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
import { UserType } from './types/userType.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string, user_type: UserType) {
    const existUser = await this.findOne(email);

    console.log(user_type);

    if (!_.isNil(existUser)) {
      throw new ConflictException('이미 가입된 아이디입니다');
    }

    const hashedPassword = await hash(password, 10);

    await this.userRepository.save({
      email,
      password: hashedPassword,
      user_type,
    });

    return `회원 가입 완료`;
  }

  async signIn(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email, deletedAt: null },
      select: ['user_id', 'email', 'password'],
    });

    if (_.isNil(user)) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const payload = { user_id: user.user_id, email };

    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: { email, deletedAt: null },
    });
  }
}
