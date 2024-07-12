import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpExceptionFilter } from 'src/common/handle-exception/httpException.filter';
import { HandleResponseInterceptor } from 'src/common/interceptor/response.interceptor';
import { SearchUserDto } from './dto/search-user.dto';

@Controller('users')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(HandleResponseInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(@Body() searchUserDto: SearchUserDto) {
    return this.usersService.findAll(searchUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
