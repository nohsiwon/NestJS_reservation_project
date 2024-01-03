import { PickType } from '@nestjs/mapped-types';
('class-validator');
import { Show } from '../entities/show.entity';

export class CreateShowDto extends PickType(Show, [
  'title',
  'description',
  'seat',
  'point',
  'show_shop',
  'show_date',
  'show_image',
  'show_category',
] as const) {}
