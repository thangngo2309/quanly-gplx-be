import { UserRole } from '../../enum/user-role';

export class ProfileResponseDto {
  user_id: number;
  username: string;
  fullname: string | null;
  role: UserRole;
  is_active: boolean;
}