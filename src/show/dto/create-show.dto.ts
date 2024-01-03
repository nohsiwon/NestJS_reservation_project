import { PickType } from '@nestjs/mapped-types';
('class-validator');
import { Show } from '../entities/show.entity';

export class CreateShowDto extends PickType(Show, [
  'title',
  'description',
  'seat',
  'point',
  'show_date',
] as const) {}
