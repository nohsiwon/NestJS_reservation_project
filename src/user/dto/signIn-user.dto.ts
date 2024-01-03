import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class SignInUserDto extends PickType(User, [
  'email',
  'password',
  'user_type',
] as const) {}
