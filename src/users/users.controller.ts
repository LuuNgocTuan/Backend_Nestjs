import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import type { IUser } from './users.interface';
import { use } from 'passport';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @ResponseMessage('Create a new user by company success')
    @Post()
    async create(
        // @Body('email') myEmail: string, //cái @Body() này để lấy dữ liệu từ body request như nodejs là req.body
        // @Body('password') myPassword: string,
        // @Body('name')
        @Body() createUserDto: CreateUserDto,
        @User() user: IUser
    ) {
        const createUser = await this.usersService.create(createUserDto, user);
        return {
            _id: createUser._id,
            createdAt: createUser.createdAt
        }
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        // @Param() params: any //cái @Param() này để lấy dữ liệu từ params url như nodejs là req.params
        return this.usersService.findById(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
