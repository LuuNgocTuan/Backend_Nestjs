import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, Matches, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;
    @IsNotEmpty()
    name: string;
}
export class CreateUserDto {
    @IsNotEmpty({
        message: 'Name không được để trống',
    })
    name: string;

    @IsEmail({}, {
        message: 'Email không hợp lệ',
    })
    @IsNotEmpty({
        message: 'Email không được để trống',
    })
    email: string;

    @IsNotEmpty({
        message: 'Password không được để trống',
    })
    password: string;

    @IsNotEmpty({ message: 'Confirm password không được để trống' })
    confirmPassword: string;

    @IsNotEmpty({
        message: 'Age không được để trống',
    })
    age: number;

    @IsNotEmpty({
        message: 'Gender không được để trống',
    })
    gender: string;

    @IsNotEmpty({
        message: 'Address không được để trống',
    })
    address: string;

    @IsNotEmpty({
        message: 'Role không được để trống',
    })
    role: string;

    // @IsNotEmptyObject()
    // @IsObject()
    // @ValidateNested()
    // @Type(() => Company)
    // company: Company;
}

export class RegisterUserDto {
    @IsNotEmpty({
        message: 'Name không được để trống',
    })
    name: string;

    @IsEmail({}, {
        message: 'Email không hợp lệ',
    })
    @IsNotEmpty({
        message: 'Email không được để trống',
    })
    email: string;

    @IsNotEmpty({
        message: 'Password không được để trống',
    })
    password: string;

    @IsNotEmpty({
        message: 'Confirm Password không được để trống',
    })
    confirmPassword: string;

    @IsNotEmpty({
        message: 'Age không được để trống',
    })
    age: number;

    @IsNotEmpty({
        message: 'Gender không được để trống',
    })
    gender: string;

    @IsNotEmpty({
        message: 'Address không được để trống',
    })
    address: string;
}
