import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageInputDto } from '../paging/page-input.dto';
import { PageDto } from '../paging/page.dto';
import { User } from './entities/user.entity';
import { UpdateMultiUserDto } from './dto/update-multi-user.dto';
import { DeleteMultiUserDto } from './dto/delete-multi-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UserRole } from '../enum/user-role';
import { Roles } from '../decorator/roles.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/find-all')
  findAll(@Query() pageInputDto: PageInputDto, @Body() filterDto: FilterUserDto): Promise<PageDto<User>> {
    return this.userService.findAll(pageInputDto, filterDto);
  }

  @Post('/unique-username')
  uniqueUsername(@Body('username') username: string, @Body('id') id?: number) {
    return this.userService.uniqueUsername(username, id);
  }

  @Post('/unique-citizen-id')
  uniqueCitizenId(@Body('citizen_id') citizen_id: string, @Body('id') id?: number) {
    return this.userService.uniqueCitizenId(citizen_id, id);
  }

  @Post('/unique-teacher-certificate-number')
  uniqueTeacherCertificateNumber(@Body('teacher_certificate_number') teacher_certificate_number: string, @Body('id') id?: number) {
    return this.userService.uniqueTeacherCertificateNumber(teacher_certificate_number, id);
  }

  @Post('/unique-health-certificate-number')
  uniqueHealthCertificateNumber(@Body('health_certificate_number') health_certificate_number: string, @Body('id') id?: number) {
    return this.userService.uniqueHealthCertificateNumber(health_certificate_number, id);
  }

  @Post('/unique-contract-number')
  uniqueContractNumber(@Body('contract_number') contract_number: string, @Body('id') id?: number) {
    return this.userService.uniqueContractNumber(contract_number, id);
  }

  @Post('/unique-phone-number')
  uniquePhoneNumber(@Body('phone_number') phone_number: string, @Body('id') id?: number) {
    return this.userService.uniquePhoneNumber(phone_number, id);
  }

  @Post('/unique-email')
  uniqueEmail(@Body('email') email: string, @Body('id') id?: number) {
    return this.userService.uniqueEmail(email, id);
  }

  @Patch('/reset-password/:id')
  @Roles([UserRole.ADMIN])
  resetPassword(@Param('id') id: string) {
    return this.userService.resetPassword(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('update-multiple')
  updateMultiple(@Body() multiUserDto: UpdateMultiUserDto) {
    return this.userService.updateMultiple(multiUserDto);
  }

  @Post('delete-multiple')
  deleteMulti(@Body() deleteUserDto: DeleteMultiUserDto) {
    return this.userService.deleteMulti(deleteUserDto);
  }

  @Post('change-password/:id')
  changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(+id, changePasswordDto);
  }
}
