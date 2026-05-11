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
    const existing = await this.userRepository
    .createQueryBuilder('user')
    .where('user.username = :username', { username: createUserDto.username })
    .getOne();

    if (existing) {
      throw new BadRequestException('Username đã tồn tại');
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
    return await this.userRepository.findOneBy({ user_id: id });
  }

  findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const toUpdate = await this.userRepository.findOneBy({ user_id: id });

    if (!toUpdate) 
      throw new BadRequestException('Không tìm thấy người dùng với ID này');
    
    const { password, ...userWithoutPassword } = updateUserDto;
    if(Object.keys(userWithoutPassword).length <= 0) 
      throw new BadRequestException('Không có dữ liệu để cập nhật');
    await this.userRepository.update({ user_id: id }, { ...userWithoutPassword});
    return this.userRepository.findOneBy({ user_id: id }) as Promise<User>;
  }

  remove(id: number): Promise<void> {
    return this.userRepository.delete({ user_id: id }).then(() => undefined);
  }

  async findAll(pageInputDto: PageInputDto): Promise<PageDto<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder
      .orderBy('user.user_id', pageInputDto.orderBy)
      .where('user.fullname LIKE :searchName', { searchName: `%${pageInputDto.searchName || ''}%` })
      .skip(pageInputDto.skip)
      .take(pageInputDto.limit);

    const itemCount = await queryBuilder.getCount();
    const itemTotalCount = await this.userRepository.count();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto(pageInputDto, itemCount, itemTotalCount);

    return new PageDto(entities, pageMetaDto);
  }
}