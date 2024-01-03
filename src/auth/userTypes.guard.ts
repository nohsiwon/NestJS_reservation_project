import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserType } from 'src/user/types/userType.type';

@Injectable()
export class UserTypeGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const authenticated = await super.canActivate(context);
    if (!authenticated) {
      return false;
    }

    const requiredTypes = this.reflector.getAllAndOverride<UserType[]>(
      'userTypes',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredTypes) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    return requiredTypes.some((type) => user.user_type === type);
  }
}
