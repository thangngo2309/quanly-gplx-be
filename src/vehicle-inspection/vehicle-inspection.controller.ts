import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VehicleInspectionService } from './vehicle-inspection.service';
import { CreateVehicleInspectionDto } from './dto/create-vehicle-inspection.dto';
import { UpdateVehicleInspectionDto } from './dto/update-vehicle-inspection.dto';
import { PageInputDto } from '../paging/page-input.dto';
import { PageDto } from '../paging/page.dto';
import { VehicleInspection } from './entities/vehicle-inspection.entity';
import { FilterVehicleInspectionDto } from './dto/filter-vehicle-inspection.dto';

@Controller('vehicle-inspection')
export class VehicleInspectionController {
  constructor(private readonly vehicleInspectionService: VehicleInspectionService) { }

  @Post()
  create(@Body() createVehicleInspectionDto: CreateVehicleInspectionDto) {
    return this.vehicleInspectionService.create(createVehicleInspectionDto);
  }

  @Post('/find-all')
  findAll(@Query() pageInputDto: PageInputDto, @Body() filterDto: FilterVehicleInspectionDto): Promise<PageDto<VehicleInspection>> {
    return this.vehicleInspectionService.findAll(pageInputDto, filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleInspectionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleInspectionDto: UpdateVehicleInspectionDto) {
    return this.vehicleInspectionService.update(+id, updateVehicleInspectionDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.vehicleInspectionService.delete(+id);
  }
}