import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DriverLicenseService } from './driver-license.service';
import { CreateDriverLicenseDto } from './dto/create-driver-license.dto';
import { UpdateDriverLicenseDto } from './dto/update-driver-license.dto';
import { DriverLicenseFilterDto } from './dto/filter-driver-license.dto';
import { PageDto } from '../paging/page.dto';
import { DriverLicense } from './entities/driver-license.entity';
import { PageInputDto } from '../paging/page-input.dto';
import { UpdateMultiDriverLicenseDto } from './dto/update-multi-driver-license.dto';

@Controller('driver-license')
export class DriverLicenseController {
  constructor(private readonly driverLicenseService: DriverLicenseService) {}

 @Post()
  create(@Body() createDriverLicense: CreateDriverLicenseDto) {
    return this.driverLicenseService.create(createDriverLicense);
  }

  @Post('/find-all')
  findAll(@Query() pageInputDto: PageInputDto, @Body() filterDto: DriverLicenseFilterDto): Promise<PageDto<DriverLicense>> {
    return this.driverLicenseService.findAll(pageInputDto, filterDto);
  }

  @Post('update-multiple')
  updateMultiple(@Body() updateMultiDriverLicenses: UpdateMultiDriverLicenseDto) {
    return this.driverLicenseService.updateMultiple(updateMultiDriverLicenses);
  }

  @Post('delete-multiple')
  deleteMultiple(@Body() deleteMultiDriverLicense: UpdateMultiDriverLicenseDto) {
    return this.driverLicenseService.deleteMulti(deleteMultiDriverLicense);
  }

  @Post('/unique-license-number')
  uniqueLicenseNumber(@Body('licenseNumber') licenseNumber: string, @Body('id') id?: number) {
    return this.driverLicenseService.checkUniqueDriverLicenseNumber(licenseNumber, id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverLicenseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDriverLicenseDto: UpdateDriverLicenseDto) {
    return this.driverLicenseService.update(+id, updateDriverLicenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverLicenseService.remove(+id);
  }
}
