import { ConfigService } from '@nestjs/config';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET') as string,
        });
    }

    async validate(payload: IUser) {
        const { _id, name, email, role } = payload;
        return { _id, name, email, role };
    }
}

// JwtStrategy sẽ được sử dụng để xác thực token khi người dùng gửi yêu cầu đến server, nó sẽ kiểm tra xem token có hợp lệ không và trả về thông tin user nếu token hợp lệ