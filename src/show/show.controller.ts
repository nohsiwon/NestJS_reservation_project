import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ShowService } from './show.service';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { UserTypeGuard } from 'src/auth/userTypes.guard';
import { UserTypes } from 'src/auth/userType.decorator';
import { UserType } from 'src/user/types/userType.type';

@UseGuards(UserTypeGuard)
@Controller('show')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @UserTypes(UserType.Admin)
  @Post()
  create(@Body() createShowDto: CreateShowDto) {
    return this.showService.create(createShowDto);
  }

  @Get()
  findAll() {
    return this.showService.findAll();
  }

  @Get('/search')
  findByTitle(@Body('title') title: string) {
    return this.showService.findByTitle(title);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showService.findOne(+id);
  }

  @UserTypes(UserType.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShowDto: UpdateShowDto) {
    return this.showService.update(+id, updateShowDto);
  }

  @UserTypes(UserType.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showService.remove(+id);
  }
}
