import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Service } from '../services/entities/service.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { FilterBookingDto } from './dto/filter-booking.dto';
import { BookingStatus } from './enums/booking-status.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { serviceId, bookingDate, bookingTime } = createBookingDto;

    // 1. Check if service exists and is active
    const service = await this.serviceRepository.findOne({ where: { id: serviceId } });
    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }
    if (!service.isActive) {
      throw new BadRequestException(`Service with ID ${serviceId} is currently inactive`);
    }

    // 2. Ensure bookingDate is not in the past
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Start of today
    const bDate = new Date(bookingDate);
    if (bDate < currentDate) {
      throw new BadRequestException('Booking dates cannot be in the past');
    }

    // 3. Prevent duplicate bookings for the same service, date, and time
    const existingBooking = await this.bookingRepository.findOne({
      where: {
        serviceId,
        bookingDate,
        bookingTime,
        status: BookingStatus.CONFIRMED, // Or PENDING, depends on logic, let's check any non-cancelled
      },
    });

    if (existingBooking && existingBooking.status !== BookingStatus.CANCELLED) {
      throw new BadRequestException('This time slot is already booked for the selected service');
    }

    const booking = this.bookingRepository.create(createBookingDto);
    return await this.bookingRepository.save(booking);
  }

  async findAll(filterDto: FilterBookingDto): Promise<{ data: Booking[]; total: number; page: number; limit: number }> {
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

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: { service: true },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async updateStatus(id: string, updateBookingStatusDto: UpdateBookingStatusDto): Promise<Booking> {
    const booking = await this.findOne(id);

    // Business rule: Cancelled bookings cannot be marked as completed
    if (booking.status === BookingStatus.CANCELLED && updateBookingStatusDto.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cancelled bookings cannot be marked as completed');
    }

    booking.status = updateBookingStatusDto.status;
    return await this.bookingRepository.save(booking);
  }

  async cancel(id: string): Promise<Booking> {
    return this.updateStatus(id, { status: BookingStatus.CANCELLED });
  }
}
