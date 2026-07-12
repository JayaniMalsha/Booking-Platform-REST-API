import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../enums/booking-status.enum';

export class UpdateBookingStatusDto {
  @ApiProperty({ enum: BookingStatus, description: 'The new status for the booking' })
  @IsEnum(BookingStatus)
  @IsNotEmpty()
  status: BookingStatus;
}
