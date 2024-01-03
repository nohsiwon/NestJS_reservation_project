import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SignInUserDto } from './dto/signIn-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signUp')
  async signUp(@Body() signInUserDTO: SignInUserDto) {
    return await this.userService.signUp(
      signInUserDTO.email,
      signInUserDTO.password,
    );
  }

  @Post('/signIn')
  async signIn(@Body() signInUserDTO: SignInUserDto) {
    return await this.userService.signIn(
      signInUserDTO.email,
      signInUserDTO.password,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/email')
  getEmail(@UserInfo() user: User) {
    return { email: user.email };
  }
}
