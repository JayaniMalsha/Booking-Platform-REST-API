"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('database', () => {
    const dbType = process.env.DB_TYPE || 'sqlite';
    if (dbType === 'postgres') {
        return {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres_password_123',
            database: process.env.DB_NAME || 'booking_platform',
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            migrations: [__dirname + '/../migrations/*{.ts,.js}'],
            synchronize: false,
            logging: false,
        };
    }
    return {
        type: 'better-sqlite3',
        database: process.env.DB_DATABASE || 'booking_db.sqlite',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        synchronize: false,
        logging: false,
    };
});
//# sourceMappingURL=database.config.js.map