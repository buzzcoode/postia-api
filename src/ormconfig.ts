import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'articlesapi',
  password: 'q1w2e3r4t5y6',
  database: 'articlesapi',
};

export default config;
