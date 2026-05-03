import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],//để có thể sử dụng UsersService trong AuthModule, vì AuthService cần phải gọi hàm findOneByUsername của UsersService để kiểm tra xem username có tồn tại trong database hay không
})
export class UsersModule { }
