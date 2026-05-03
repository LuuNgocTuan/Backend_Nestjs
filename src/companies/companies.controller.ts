import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import type { Request } from 'express';
import { ResponseMessage, User } from 'src/decorator/customize';
import type { IUser } from 'src/users/users.interface';

@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }

    //Cách 1 để lấy thông tin người dùng từ request
    //   @Post()
    //   create(@Body() createCompanyDto: CreateCompanyDto, @Req() req: Request) {
    //     const user = req.user; // Lấy thông tin người dùng từ request
    //     console.log('User info:', user); // In thông tin người dùng ra console để kiểm tra
    //     return this.companiesService.create(createCompanyDto);
    //   }

    // Cách 2 để lấy thông tin người dùng từ request
    @Post()
    create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
        console.log('User info:', user); // In thông tin người dùng ra console để kiểm tra
        return this.companiesService.create(createCompanyDto, user);
    }

    @Get()
    @ResponseMessage('Lấy danh sách công ty thành công')
    findAll(
        @Query('current') currentPage: number,
        @Query('pageSize') limit: number,
        @Query() qs: string,
    ) {
        return this.companiesService.findAll(currentPage, limit, qs);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.companiesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @User() user: IUser) {
        return this.companiesService.update(id, updateCompanyDto,user);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.companiesService.remove(id,user);
    }
}
