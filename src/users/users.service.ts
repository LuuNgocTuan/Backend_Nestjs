import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model, Types } from 'mongoose';
import { hashPassword } from 'src/auth/utils/password.util';
import type { SoftDeleteModel } from 'mongoose-delete';
import { MongoServerError } from 'mongodb';
import { IUser } from './users.interface';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { }

    // async getHashPassword(password: string): Promise<string> {
    //     const saltOrRounds = 10;
    //     const hash = await bcrypt.hash(password, saltOrRounds);
    //     return hash;
    // }

    // async create(email: string, password: string, name: string) {
    //     const hashPassword = await this.getHashPassword(password);
    //     const user = await this.userModel.create({ email, password: hashPassword, name });
    //     return user;
    // }

    //không cần phải truyền từng tham số như email, password, name,... mà có thể truyền thẳng cả object createUserDto vào hàm create

    async create(createUser: CreateUserDto, user: IUser) {
        const { email, password, confirmPassword } = createUser

        //1. Validate confirm Password
        if (password !== confirmPassword) {
            throw new BadRequestException('Confirm password does not match')
        }
        //2. Check email
        const isEmailExist = await this.userModel.findOne({ email })  //hoặc có thể dùng 'const isEmailExist= await this.userModel.findOne({email:userDto.email})'
        if (isEmailExist) {
            throw new ConflictException(`Email ${email} already exists`)
        }
        //3. Hash Password
        const hashedPassword = await hashPassword(password);

        try {
            // 4. create user
            const newUser = await this.userModel.create({
                ...createUser,
                password: hashedPassword,
                role: createUser.role ?? 'USER',
                company: {
                    _id: user._id,
                    name: user.name
                },
                createdBy: {
                    _id: user._id,
                    email: user.email
                }
            });

            return newUser;

        } catch (error: unknown) {
            // 5. handle duplicate race condition (có 2 request đầu gửi lên cùng lần)
            if (error instanceof MongoServerError && error.code === 11000) {
                throw new ConflictException(`Email ${email} đã tồn tại`);
            }
            throw error;
        }
    }

    async register(userDto: RegisterUserDto) {
        const { email, password, confirmPassword } = userDto

        // 1. validate confirm password
        if (password !== confirmPassword) {
            throw new BadRequestException('Confirm password does not match');
        }
        //2. check email
        const isEmailExist = await this.userModel.findOne({ email })
        if (isEmailExist) {
            throw new ConflictException(`Email ${email} already exists`)
        }
        //Continue create user

        //3. Hash password
        const hashedPassword = await hashPassword(password);

        try {
            // 4. create user
            const newUser = await this.userModel.create({
                ...userDto,
                password: hashedPassword,
                role: 'USER',
            });

            return newUser;
        } catch (error: unknown) {
            // 5. handle duplicate race condition (có 2 request đầu gửi lên cùng lần)
            if (error instanceof MongoServerError && error.code === 11000) {
                throw new ConflictException(`Email ${email} đã tồn tại`);
            }
            throw error;
        }

    }

    async findAll(currentPage: number, limit: number, qs: string) {
        const { filter, sort, projection, population } = aqp(qs);
        delete filter.current;
        delete filter.pageSize;

        const offset = (currentPage - 1) * (limit);
        const defaultLimit = limit ? +limit : 10;
        const totalItems = await this.userModel.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / defaultLimit);

        const result = await this.userModel.find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort as any)
            .select('-password -refreshToken')
            .populate(population)
            .exec();

        return {
            meta: {
                current: currentPage, //trang hiện tại
                pageSize: limit, //số lượng bản ghi đã lấy
                pages: totalPages, //tổng số trang với điều kiện query
                total: totalItems // tổng số phần tử (số bản ghi)
            },
            result //kết quả query
        }
    }

    findOneByUsername(username: string) {
        return this.userModel.findOne({
            email: username
        });
    }

    async findById(id: string) {
        // return `This action returns a #${id} user`;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return 'Not found user'; // Hoặc bạn có thể trả về một lỗi hoặc giá trị mặc định khác
        }
        const user = await this.userModel
            .findById(id)
            .select('-password -refreshToken')
        return user;

    }

    async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
        // return `This action updates a #${id} user`;
        const userUpdate = await this.userModel.updateOne(
            { _id: id },
            {
                ...updateUserDto,
                updatedBy:
                {
                    _id: user._id,
                    email: user.email
                }
            });
        return userUpdate
    }

    async remove(id: string, user: IUser) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return 'Not found user';
        }
        await this.userModel.updateOne(
            { _id: id },
            {
                deletedBy: {
                    _id: user._id,
                    email: user.email
                }
            }
        )
        return this.userModel.delete({ _id: id });

    }

    updateRefreshToken = async (id: string, refreshToken: string) => {
        //khi login và validate đúng, thì toàn bộ thông tin user sẽ được gắn vào req.user và gửi đến server, controller sẽ gọi hàm trong file service tương ứng để thực thi, trong đó có trường _id 
        const refresh_Token = await this.userModel.updateOne(
            { _id: id },
            { refreshToken }
        )
        return refresh_Token
    }

    async findRefreshTokenById(id: string) {
        const refresh_token = await this.userModel.findOne(
            {
                _id: id,
            },
        )
        return refresh_token
    }
}
