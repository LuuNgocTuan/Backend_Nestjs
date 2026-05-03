import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from './utils/password.util';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    // Hàm validateUser sẽ được gọi khi người dùng đăng nhập, nó sẽ kiểm tra xem username và password có hợp lệ không
    async validateUser(username: string, pass: string): Promise<any> {
        // 1️⃣ tìm user theo username
        const user = await this.usersService.findOneByUsername(username);
        if (!user) {
            return null;
            // throw new UnauthorizedException();
        }
        // 2️⃣ so sánh password
        const isMatch = await comparePassword(pass, user.password);
        if (!isMatch) {
            return null;
        }
        // 3️⃣ loại bỏ password trước khi trả về thông tin user

        const { password, ...result } = user.toObject
            ? user.toObject()
            : user;
        return result;
    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };

        const refresh_token = await this.createRefreshToken(payload)

        //update user in DB with refresh token
        await this.usersService.updateRefreshToken(_id, refresh_token)

        //set refresh token as cookies
        response.cookie('refresh_token', refresh_token,
            {
                httpOnly: true,
                maxAge: this.configService.get<number>('jwt.refreshExpire')
            }
        )

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role
            }
        };
    }

    register = async (registerDto: RegisterUserDto) => {
        const createUser = await this.usersService.register(registerDto)
        return {
            _id: createUser._id,
            createdAt: createUser.createdAt
        }
    }

    createRefreshToken = async (payload: any) => {
        const refresh_Token = await this.jwtService.sign(payload,
            {
                secret: this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
                expiresIn: this.configService.get<number>('jwt.refreshExpire')! / 1000
            }
        )
        return refresh_Token
    }

}
