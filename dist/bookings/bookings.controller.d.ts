import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { FilterBookingDto } from './dto/filter-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto): Promise<import("./entities/booking.entity").Booking>;
    findAll(filterDto: FilterBookingDto): Promise<{
        data: import("./entities/booking.entity").Booking[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("./entities/booking.entity").Booking>;
    updateStatus(id: string, updateBookingStatusDto: UpdateBookingStatusDto): Promise<import("./entities/booking.entity").Booking>;
    remove(id: string): Promise<import("./entities/booking.entity").Booking>;
}
