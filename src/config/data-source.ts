import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const dbType = process.env.DB_TYPE || 'sqlite';

let AppDataSource: DataSource;

if (dbType === 'postgres') {
  AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres_password_123',
    database: process.env.DB_NAME || 'booking_platform',
    entities: [path.resolve(__dirname, '../**/*.entity{.ts,.js}')],
    migrations: [path.resolve(__dirname, '../migrations/*{.ts,.js}')],
    synchronize: false,
    logging: false,
  });
} else {
  AppDataSource = new DataSource({
    type: 'better-sqlite3' as any,
    database: process.env.DB_DATABASE || 'booking_db.sqlite',
    entities: [path.resolve(__dirname, '../**/*.entity{.ts,.js}')],
    migrations: [path.resolve(__dirname, '../migrations/*{.ts,.js}')],
    synchronize: false,
    logging: false,
  });
}

export default AppDataSource;
