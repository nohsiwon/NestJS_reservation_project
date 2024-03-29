import Joi from 'joi';

import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ShowModule } from './show/show.module';
import { ReservationModule } from './reservation/reservation.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { Show } from './show/entities/show.entity';
import { Reservation } from './reservation/entities/reservation.entity';
import { AuthModule } from './auth/auth.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [User, Show, Reservation],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    ReservationModule,
    UserModule,
    ShowModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
