import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Not, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../enum/user-role';
import * as bcrypt from 'bcrypt';
import { PageInputDto } from '../paging/page-input.dto';
import { PageDto } from '../paging/page.dto';
import { PageMetaDto } from '../paging/page-meta.dto';
import { UpdateMultiUserDto } from './dto/update-multi-user.dto';
import { DeleteMultiUserDto } from './dto/delete-multi-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.checkuniquefield(createUserDto);
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
    const existing = await this.userRepository.findOne({ where: { user_id: id, is_deleted: false } });

    if (!existing)
      throw new BadRequestException('Không tìm thấy người dùng này');

    await this.checkuniquefield(updateUserDto, id);

    const finalcontract_signed_date = updateUserDto.contract_signed_date ?? existing.contract_signed_date;
    const finalcontract_expiry_date = updateUserDto.contract_expiry_date ?? existing.contract_expiry_date;

    if (new Date(finalcontract_signed_date) > new Date(finalcontract_expiry_date)) {
      throw new BadRequestException('Ngày hết hạn hợp đồng phải lớn hơn ngày ký');
    }

    await this.userRepository.update({ user_id: id }, updateUserDto);
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

  async findAll(pageInputDto: PageInputDto) {
    const queryBuilder =
      this.userRepository.createQueryBuilder('user');

     const conditions: { condition: string; params: object }[] = [
      !!pageInputDto.name && {
        condition: 'user.fullname LIKE :name',
        params: { name: `%${pageInputDto.name}%`,},
      },
      !!pageInputDto.cccd && {
        condition: 'user.citizen_id LIKE :cccd',
        params: { cccd: `%${pageInputDto.cccd}%` },
      },
      typeof pageInputDto.active === 'boolean' && {
        condition: 'user.is_active = :active',
        params: { active: pageInputDto.active },
      }
    ].filter(Boolean) as { condition: string; params: object }[];

    queryBuilder.where(
      'user.is_deleted = false'
    );
    conditions.forEach((item) => {
      queryBuilder.andWhere(
        item.condition,
        item.params
      );
    });

    queryBuilder
      .orderBy(
        'user.user_id',
        pageInputDto.orderBy
      )
      .skip(pageInputDto.skip)
      .take(pageInputDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto(pageInputDto, itemCount);

    return new PageDto(entities, pageMetaDto);
  }

  private async checkuniquefield(dto: CreateUserDto | UpdateUserDto, id?: number) {
    const fields: string[] = ['username', 'citizen_id', 'teacher_certificate_number', 'health_certificate_number', 'contract_number'];
    for (const field of fields) {
      if (dto[field]) {
        const existing = await this.userRepository.findOne({
          where: {
            [field]: dto[field],
            is_deleted: false,
            ...(id ? { user_id: Not(id) } : {})
          }
        });
        if (existing) {
          throw new BadRequestException(`Giá trị ${field} đã tồn tại`);
        }
      }
    }
  }

  private async findMany(ids: number[]): Promise<User[]> {
    return this.userRepository.find({
      where: {
        user_id: In(ids),
        is_deleted: false
      }
    });
  }

  async updateMultiple(multiUserDto: UpdateMultiUserDto) {
    const existingUsers = await this.findMany(multiUserDto.user_ids);

    const updatedIds = existingUsers.map(user => Number(user.user_id));
    const notFoundIds = multiUserDto.user_ids
      .map(id => Number(id)).filter(id => !updatedIds.includes(id));

    const finalcontract_signed_date = multiUserDto.data.contract_signed_date || existingUsers[0]?.contract_signed_date;
    const finalcontract_expiry_date = multiUserDto.data.contract_expiry_date || existingUsers[0]?.contract_expiry_date;

    if (new Date(finalcontract_signed_date) > new Date(finalcontract_expiry_date)) {
      throw new BadRequestException('Ngày hết hạn hợp đồng phải lớn hơn ngày ký');
    }

    await this.userRepository.update(
      { user_id: In(updatedIds) },
      multiUserDto.data
    );
    return {
      updatedUser: await this.findMany(updatedIds),
      missingIds: notFoundIds,
    };
  }

  async deleteMulti(deleteUserDto: DeleteMultiUserDto) {
    const existing = await this.userRepository.find({
      where: {
        user_id: In(deleteUserDto.user_ids)
      }
    });

    const existingIds = existing.map(user => Number(user.user_id));
    const notFoundIds = deleteUserDto.user_ids
      .map(id => Number(id))
      .filter(id => !existingIds.includes(id));

    if (existingIds.length > 0) {
      await this.userRepository.update(
        { user_id: In(existingIds) },
        { is_deleted: true },
      );
    }

    return {
      deletedIds: existingIds,
      missingIds: notFoundIds,
    };
  }
} 