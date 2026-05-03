import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { hashPassword } from 'src/auth/utils/password.util';
import type { SoftDeleteModel } from 'mongoose-delete';
import { MongoServerError } from 'mongodb';
import { IUser } from './users.interface';

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

    findAll() {
        return `This action returns all users`;
    }

    findOneByUsername(username: string) {
        return this.userModel.findOne({
            email: username
        });
    }

    findById(id: string) {
        // return `This action returns a #${id} user`;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return 'Not found user'; // Hoặc bạn có thể trả về một lỗi hoặc giá trị mặc định khác
        }
        return this.userModel.findById(id);
        //tìm user theo id trong database, this là để truy cập đến class userModel đã được inject ở constructor, findById là hàm của mongoose để tìm theo id, id là tham số truyền vào hàm findOne
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        // return `This action updates a #${id} user`;
        return await this.userModel.updateOne({ _id: id }, { ...updateUserDto });
    }

    remove(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return 'Not found user';
        }
        return this.userModel.delete({ _id: id });

        // return `This action removes a #${id} user`;
    }
}
