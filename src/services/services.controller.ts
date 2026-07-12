import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve a paginated list of services' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Services successfully retrieved.',
  })
  @ApiQuery({
    name: 'isActive',
    type: Boolean,
    required: false,
    description: 'Filter services by active status',
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.servicesService.findAll(paginationDto, isActive);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve details of a specific service' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Service details found.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Service not found.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new service (Admin Only)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Service successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Service title already exists.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing service (Admin Only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Service successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Service not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Title already matches another service.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a service (Admin Only)' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Service successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Service not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.remove(id);
  }
}
