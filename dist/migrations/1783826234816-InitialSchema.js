"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1783826234816 = void 0;
const typeorm_1 = require("typeorm");
class InitialSchema1783826234816 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    isGenerated: true,
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'password',
                    type: 'varchar',
                },
                {
                    name: 'createdAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updatedAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'refresh_tokens',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    isGenerated: true,
                },
                {
                    name: 'token',
                    type: 'varchar',
                },
                {
                    name: 'expiresAt',
                    type: 'datetime',
                },
                {
                    name: 'userId',
                    type: 'varchar',
                },
                {
                    name: 'createdAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createForeignKey('refresh_tokens', new typeorm_1.TableForeignKey({
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'services',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    isGenerated: true,
                },
                {
                    name: 'title',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'description',
                    type: 'text',
                },
                {
                    name: 'duration',
                    type: 'int',
                },
                {
                    name: 'price',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                },
                {
                    name: 'isActive',
                    type: 'boolean',
                    default: true,
                },
                {
                    name: 'createdAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updatedAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'bookings',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    isGenerated: true,
                },
                {
                    name: 'customerName',
                    type: 'varchar',
                },
                {
                    name: 'customerEmail',
                    type: 'varchar',
                },
                {
                    name: 'customerPhone',
                    type: 'varchar',
                },
                {
                    name: 'serviceId',
                    type: 'varchar',
                },
                {
                    name: 'bookingDate',
                    type: 'date',
                },
                {
                    name: 'bookingTime',
                    type: 'varchar',
                },
                {
                    name: 'status',
                    type: 'varchar',
                    default: "'pending'",
                },
                {
                    name: 'notes',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'createdAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updatedAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createForeignKey('bookings', new typeorm_1.TableForeignKey({
            columnNames: ['serviceId'],
            referencedTableName: 'services',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        const bookingsTable = await queryRunner.getTable('bookings');
        if (bookingsTable) {
            const bookingsFk = bookingsTable.foreignKeys.find((fk) => fk.columnNames.indexOf('serviceId') !== -1);
            if (bookingsFk) {
                await queryRunner.dropForeignKey('bookings', bookingsFk);
            }
        }
        await queryRunner.dropTable('bookings', true);
        await queryRunner.dropTable('services', true);
        const refreshTokensTable = await queryRunner.getTable('refresh_tokens');
        if (refreshTokensTable) {
            const refreshTokensFk = refreshTokensTable.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
            if (refreshTokensFk) {
                await queryRunner.dropForeignKey('refresh_tokens', refreshTokensFk);
            }
        }
        await queryRunner.dropTable('refresh_tokens', true);
        await queryRunner.dropTable('users', true);
    }
}
exports.InitialSchema1783826234816 = InitialSchema1783826234816;
//# sourceMappingURL=1783826234816-InitialSchema.js.map