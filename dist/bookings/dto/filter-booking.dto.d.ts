import { BookingStatus } from '../enums/booking-status.enum';
export declare class FilterBookingDto {
    status?: BookingStatus;
    serviceId?: string;
    page?: number;
    limit?: number;
}
