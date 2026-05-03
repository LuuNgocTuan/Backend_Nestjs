import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import configuration from './config/configuration';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CompaniesModule } from './companies/companies.module';
import { validationSchema } from './config/validation.schema';

@Module({
    imports: [
        // MongooseModule.forRoot('mongodb+srv://askAutomation:U40FreolxBoZQqtq@cluster0.qseat.mongodb.net/'),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URL'),
            }),
            inject: [ConfigService],
        }),

        // ConfigModule.forRoot({
        //     isGlobal: true,
        // }),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validationSchema: validationSchema,
        }),

        UsersModule,
        AuthModule,
        CompaniesModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        // {
        //     provide: APP_GUARD,
        //     useClass: JwtAuthGuard,
        // },
        //chuyển sang cách sử dụng global guard trong main.ts để có thể sử dụng được reflector trong JwtAuthGuard
    ],
})
export class AppModule { }
