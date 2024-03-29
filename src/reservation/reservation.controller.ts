import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post(':showId')
  async reserve(@UserInfo() user: User, @Param('showId') showId: number) {
    return this.reservationService.reserve(+user.userId, +showId);
  }

  @Get()
  findAll(@UserInfo() user: User) {
    return this.reservationService.findAll(+user.userId);
  }

  @Delete(':reservationId')
  remove(
    @UserInfo() user: User,
    @Param('reservationId') reservationId: number,
  ) {
    return this.reservationService.remove(+reservationId);
  }
}
