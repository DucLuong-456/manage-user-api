import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SearchUserDto } from './dto/search-user.dto';
import { PagingResponse } from 'src/common/types/pagingResponse.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.save(createUserDto);
    return user;
  }

  async findAll(searchUserDto: SearchUserDto) {
    let { page, limit } = searchUserDto;

    limit = limit || 6;
    page = page || 1;

    const skip = limit * (page - 1);

    const [users, countUsers] = await this.userRepository.findAndCount({
      skip: skip,
      take: limit,
    });

    const paging = {
      page,
      limit,
      count: countUsers > limit ? limit : countUsers,
    };
    return new PagingResponse(users, paging);
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException();
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    await this.userRepository.save({ ...user, ...updateUserDto });
    return user;
  }

  async remove(id: number) {
    const user = await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id: id })
      .execute();
    return user;
  }
}
