import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    findAll(paginationDto: PaginationDto, isActive?: boolean): Promise<{
        items: import("./entities/service.entity").Service[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("./entities/service.entity").Service>;
    create(createServiceDto: CreateServiceDto): Promise<import("./entities/service.entity").Service>;
    update(id: string, updateServiceDto: UpdateServiceDto): Promise<import("./entities/service.entity").Service>;
    remove(id: string): Promise<void>;
}
