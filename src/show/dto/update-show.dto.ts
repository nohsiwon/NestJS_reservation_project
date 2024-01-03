import { OmitType } from '@nestjs/mapped-types';
import { CreateShowDto } from './create-show.dto';

export class UpdateShowDto extends OmitType(CreateShowDto, ['seat']) {}
