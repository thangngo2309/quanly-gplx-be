import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../enum/user-role';
import * as bcrypt from 'bcrypt';
import { PageInputDto } from '../paging/page-input.dto';
import { PageDto } from '../paging/page.dto';
import { PageMetaDto } from '../paging/page-meta.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: {
        username: createUserDto.username,
        is_deleted: false
      }
    });

    if (existing) {
      throw new BadRequestException('Không thể tạo với tên đăng nhập này');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || UserRole.USER,
    });
    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
  }

  async findOne(id: number): Promise<User | null> {
    const existing = await this.userRepository.findOne({ where: { user_id: id, is_deleted: false } });
    if (!existing) {
      throw new BadRequestException('Không tìm thấy người dùng này');
    }
    return existing;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .andWhere('user.is_active = true')
      .andWhere('user.is_deleted = false')
      .getOne();
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const toUpdate = await this.userRepository.findOne({ where: { user_id: id, is_deleted: false } });

    if (!toUpdate) 
      throw new BadRequestException('Không tìm thấy người dùng này');

    await this.userRepository.update({user_id: id}, updateUserDto);
    return this.userRepository.findOne({ where: { user_id: id, is_deleted: false } }) as Promise<User>;
  }

  async remove(id: number) {
    const existing = await this.userRepository.findOne({
      where: { user_id: id }
    });

    if (!existing) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }

    await this.userRepository.update({ user_id: id }, { is_deleted: true });
    return { message: 'Xóa người dùng thành công' };
  }

  async findAll(pageInputDto: PageInputDto): Promise<PageDto<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder
      .orderBy('user.user_id', pageInputDto.orderBy)
      .where('user.fullname LIKE :searchName', { searchName: `%${pageInputDto.searchName || ''}%` })
      .andWhere('user.is_deleted = false')
      .skip(pageInputDto.skip)
      .take(pageInputDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto(pageInputDto, itemCount);

    return new PageDto(entities, pageMetaDto);
  }
}