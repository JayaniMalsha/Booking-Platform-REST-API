"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const service_entity_1 = require("../services/entities/service.entity");
const booking_status_enum_1 = require("./enums/booking-status.enum");
let BookingsService = class BookingsService {
    bookingRepository;
    serviceRepository;
    constructor(bookingRepository, serviceRepository) {
        this.bookingRepository = bookingRepository;
        this.serviceRepository = serviceRepository;
    }
    async create(createBookingDto) {
        const { serviceId, bookingDate, bookingTime } = createBookingDto;
        const service = await this.serviceRepository.findOne({ where: { id: serviceId } });
        if (!service) {
            throw new common_1.NotFoundException(`Service with ID ${serviceId} not found`);
        }
        if (!service.isActive) {
            throw new common_1.BadRequestException(`Service with ID ${serviceId} is currently inactive`);
        }
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const bDate = new Date(bookingDate);
        if (bDate < currentDate) {
            throw new common_1.BadRequestException('Booking dates cannot be in the past');
        }
        const existingBooking = await this.bookingRepository.findOne({
            where: {
                serviceId,
                bookingDate,
                bookingTime,
                status: booking_status_enum_1.BookingStatus.CONFIRMED,
            },
        });
        if (existingBooking && existingBooking.status !== booking_status_enum_1.BookingStatus.CANCELLED) {
            throw new common_1.BadRequestException('This time slot is already booked for the selected service');
        }
        const booking = this.bookingRepository.create(createBookingDto);
        return await this.bookingRepository.save(booking);
    }
    async findAll(filterDto) {
        const { status, serviceId, page = 1, limit = 10 } = filterDto;
        const skip = (page - 1) * limit;
        const query = this.bookingRepository.createQueryBuilder('booking');
        if (status) {
            query.andWhere('booking.status = :status', { status });
        }
        if (serviceId) {
            query.andWhere('booking.serviceId = :serviceId', { serviceId });
        }
        query.skip(skip).take(limit).orderBy('booking.createdAt', 'DESC');
        const [data, total] = await query.getManyAndCount();
        return {
            data,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const booking = await this.bookingRepository.findOne({
            where: { id },
            relations: { service: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        return booking;
    }
    async updateStatus(id, updateBookingStatusDto) {
        const booking = await this.findOne(id);
        if (booking.status === booking_status_enum_1.BookingStatus.CANCELLED && updateBookingStatusDto.status === booking_status_enum_1.BookingStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cancelled bookings cannot be marked as completed');
        }
        booking.status = updateBookingStatusDto.status;
        return await this.bookingRepository.save(booking);
    }
    async cancel(id) {
        return this.updateStatus(id, { status: booking_status_enum_1.BookingStatus.CANCELLED });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(service_entity_1.Service)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map