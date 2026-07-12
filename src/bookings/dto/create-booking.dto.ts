import { IsString, IsEmail, IsNotEmpty, IsUUID, IsOptional, IsDateString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'John Doe', description: 'Customer Name' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: 'john@example.com', description: 'Customer Email' })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({ example: '+1234567890', description: 'Customer Phone' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiProperty({ example: 'uuid', description: 'Service ID' })
  @IsUUID()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({ example: '2026-08-01', description: 'Booking Date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  bookingDate: string;

  @ApiProperty({ example: '14:30', description: 'Booking Time (HH:mm)' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'bookingTime must be in HH:mm format',
  })
  @IsNotEmpty()
  bookingTime: string;

  @ApiProperty({ required: false, example: 'Any special notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
