import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV}`, override: true });

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  synchronize: configService.get<boolean>('SYNCHRONIZE'),
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  logging: configService.get<boolean>('LOGGING'),
});
