import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'articlesapi',
  password: 'q1w2e3r4t5y6',
  database: 'articlesapi',
  entities: [__dirname + '/**/*.entity{.ts, .js}'],
  synchronize: true,
});
