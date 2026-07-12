import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const { title } = createServiceDto;

    const existingService = await this.serviceRepository.findOne({
      where: { title },
    });
    if (existingService) {
      throw new ConflictException(`Service with title "${title}" already exists`);
    }

    const service = this.serviceRepository.create(createServiceDto);
    return this.serviceRepository.save(service as any);
  }

  async findAll(paginationDto: PaginationDto, isActive?: boolean) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.serviceRepository.createQueryBuilder('service');

    if (isActive !== undefined) {
      queryBuilder.where('service.isActive = :isActive', { isActive });
    }

    const [items, total] = await queryBuilder
      .orderBy('service.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with ID "${id}" not found`);
    }
    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);
    const { title } = updateServiceDto;

    if (title && title !== service.title) {
      const existingService = await this.serviceRepository.findOne({
        where: { title },
      });
      if (existingService) {
        throw new ConflictException(`Service with title "${title}" already exists`);
      }
    }

    const updatedService = this.serviceRepository.merge(
      service,
      updateServiceDto,
    );
    return this.serviceRepository.save(updatedService as any);
  }

  async remove(id: string): Promise<void> {
    const service = await this.findOne(id);
    await this.serviceRepository.remove(service);
  }
}
