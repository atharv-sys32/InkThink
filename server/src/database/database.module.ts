import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: +configService.get<string>('DATABASE_PORT'),
        database: configService.get<string>('DATABASE_NAME'),

        // ✅ FIX: Neon uses DATABASE_USER, not DATABASE_USERNAME
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),

        entities: [__dirname + '/../**/*.entity{.ts,.js}'],

        synchronize: configService.get<string>('APP_ENV') === 'local',

        // ✅ REQUIRED FOR NEON
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
