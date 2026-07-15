import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';
import { PageDto } from '../paging/page.dto';
import { PageInputDto } from '../paging/page-input.dto';
import { CarFilterDto } from './dto/filter-car.dto';
import { DeleteMultiCarDto } from './dto/delete-multi-car.dto';
import { UpdateMultiCarDto } from './dto/update-multi-car.dto';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) { }

  @Post()
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  @Post('/find-all')
  findAll(@Query() pageInputDto: PageInputDto, @Body() filterDto: CarFilterDto): Promise<PageDto<Car>> {
    return this.carService.findAll(pageInputDto, filterDto);
  }

  @Post('update-multiple')
  updateMultiple(@Body() updateMultiCarDtos: UpdateMultiCarDto) {
    return this.carService.updateMultiple(updateMultiCarDtos);
  }

  @Post('delete-multiple')
  deleteMultiple(@Body() deleteMultiCarDto: DeleteMultiCarDto) {
    return this.carService.deleteMulti(deleteMultiCarDto);
  }

  @Post('/unique-registration-number')
  uniqueRegistrationNumber(@Body('registrationNumber') registrationNumber: string, @Body('id') id?: number) {
    return this.carService.uniqueRegistrationNumber(registrationNumber, id);
  }

  @Post('/unique-imei-dat')
  uniqueImeiDat(@Body('imeiDat') imeiDat: string, @Body('id') id?: number) {
    return this.carService.uniqueImeiDat(imeiDat, id);
  }

  @Post('/unique-serial-number')
  uniqueSerialNumber(@Body('serialNumber') serialNumber: string, @Body('id') id?: number) {
    return this.carService.uniqueSerialNumber(serialNumber, id);
  }

  @Post('/unique-chassis-number')
  uniqueChassisNumber(@Body('chassis_number') chassis_number: string, @Body('id') id?: number) {
    return this.carService.uniqueChassisNumber(chassis_number, id);
  }

  @Post('/unique-engine-number')
  uniqueEngineNumber(@Body('engine_number') engine_number: string, @Body('id') id?: number) {
    return this.carService.uniqueEngineNumber(engine_number, id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carService.update(+id, updateCarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carService.remove(+id);
  }
}
