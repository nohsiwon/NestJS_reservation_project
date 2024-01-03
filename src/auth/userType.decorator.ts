import { UserType } from 'src/user/types/userType.type';

import { SetMetadata } from '@nestjs/common';

export const UserTypes = (...userTypes: UserType[]) =>
  SetMetadata('userTypes', userTypes);
