import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import type { Response } from 'express';


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService

    ) { }

    @Public()// @Public() này để đánh dấu route này là public, tức là không cần phải đăng nhập vẫn có thể truy cập vào route này, nếu không có @Public() thì route này sẽ bị bảo vệ bởi JwtAuthGuard và chỉ có những người đã đăng nhập mới có thể truy cập vào route này
    @UseGuards(LocalAuthGuard)//@UseGuards này để sử dụng guard bảo vệ route, ở đây mình sử dụng LocalAuthGuard để bảo vệ route login, nếu không có guard này thì route login sẽ không được bảo vệ và bất cứ ai cũng có thể truy cập vào route này mà không cần phải đăng nhập
    @Post('login')
    async login(
        @Req() req,
        @Res({ passthrough: true }) response: Response
    ) {
        return this.authService.login(req.user, response);
    }

    @Public()
    @ResponseMessage('Register a new user success')
    @Post('register')
    async register(@Body() registerDto: RegisterUserDto) {
        return await this.authService.register(registerDto)
    }

    // @Get('profile')
    // getProfile(@Request() req) {
    //     return req.user;
    // }


}