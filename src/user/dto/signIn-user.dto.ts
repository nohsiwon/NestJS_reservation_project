import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class SignInUserDto extends PickType(User, [
  'email',
  'password',
  'userType',
] as const) {}
