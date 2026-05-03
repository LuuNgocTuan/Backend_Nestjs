import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password', 'confirmPassword', 'role','email'] as const)
//OmitType là để tạo ra một class mới từ class CreateUserDto nhưng bỏ đi thuộc tính password, PartialType là để tạo ra một class mới từ class CreateUserDto nhưng tất cả các thuộc tính đều là optional, nghĩa là có thể có hoặc không có, còn OmitType thì chỉ bỏ đi thuộc tính password thôi, còn lại vẫn giữ nguyên như CreateUserDto

{ _id: string } 
