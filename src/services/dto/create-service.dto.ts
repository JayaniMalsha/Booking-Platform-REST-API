import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Unique title of the service',
    example: 'Haircut & Styling',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({
    description: 'Detailed description of the service',
    example: 'A complete haircut including washing, drying, and styling.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiProperty({
    description: 'Duration of the service in minutes',
    example: 45,
    minimum: 1,
  })
  @IsInt()
  @Min(1, { message: 'Duration must be at least 1 minute' })
  duration: number;

  @ApiProperty({
    description: 'Price of the service',
    example: 49.99,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Price must be a valid number' })
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @ApiProperty({
    description: 'Indicates if the service is active and bookable',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
