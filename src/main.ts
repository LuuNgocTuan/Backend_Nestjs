import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import *as dns from 'dns';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';

dns.setServers(['1.1.1.1', '8.8.8.8']);
async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const reflector = app.get(Reflector);
    app.useGlobalGuards(new JwtAuthGuard(reflector));
    app.useGlobalInterceptors(new TransformInterceptor(reflector));


    app.useStaticAssets(join(__dirname, '..', 'public'));//static files like css, img
    app.setBaseViewsDir(join(__dirname, '..', 'views')); //views
    app.setViewEngine('ejs');

    console.log('check path:', join(__dirname, '..', 'public'), join(__dirname, '..', 'views'));
    // const PORT = Number(process.env.PORT)

    app.useGlobalPipes(new ValidationPipe());

    const configService = app.get(ConfigService);
    const port = configService.get('PORT');

    app.enableCors(
        {
            "origin": "http://localhost:3000",
            "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
            "preflightContinue": false,
            "credentials": true,
            "optionsSuccessStatus": 204
        }
    );

    //config versioning cho API, khi mình enable versioning thì mình sẽ phải thêm version vào đường dẫn của API, ví dụ như /api/v1/companies, /api/v2/companies,... để phân biệt các version của API. Khi mình gọi API thì mình sẽ phải gọi đúng version của API đó, nếu không thì sẽ bị lỗi 404 Not Found. Việc này giúp cho việc quản lý và phát triển API trở nên dễ dàng hơn, khi mình muốn thay đổi hoặc thêm mới một tính năng nào đó thì mình chỉ cần tạo một version mới của API mà không ảnh hưởng đến các version cũ đã tồn tại.
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: ['1', '2']
    });

    await app.listen(port);

}
bootstrap();
