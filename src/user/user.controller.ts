import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageInputDto } from '../paging/page-input.dto';
import { PageDto } from '../paging/page.dto';
import { User } from './entities/user.entity';
import { UpdateMultiUserDto } from './dto/update-multi-user.dto';
import { DeleteMultiUserDto } from './dto/delete-multi-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/search')
  findAll(@Body() PageInputDto: PageInputDto) {
    return this.userService.findAll(PageInputDto);
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
}
