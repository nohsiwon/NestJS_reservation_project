import { PickType } from '@nestjs/mapped-types';
('class-validator');
import { Show } from '../entities/show.entity';

export class CreateShowDto extends PickType(Show, [
  'showId',
  'title',
  'description',
  'point',
  'show_date',
] as const) {}
