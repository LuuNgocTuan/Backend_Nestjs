import {
    SetMetadata,
    createParamDecorator,
    ExecutionContext,
} from '@nestjs/common';
import { registerDecorator, ValidationArguments } from 'class-validator';
import { ValidationOptions } from 'joi';

/* =========================
   PUBLIC ROUTE DECORATOR
========================= */
export const IS_PUBLIC_KEY = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/* =========================
   RESPONSE MESSAGE DECORATOR
========================= */
export const RESPONSE_MESSAGE_KEY = 'response_message';

export const ResponseMessage = (message: string) =>
    SetMetadata(RESPONSE_MESSAGE_KEY, message);

/* =========================
   USER DECORATOR
========================= */
export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);



/* =========================
   ĐOẠN CODE DÙNG TRƯỚC ĐÂY
========================= */

// import { SetMetadata } from '@nestjs/common';
// import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// export const IS_PUBLIC_KEY = 'isPublic';
// export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);//đây là một custom decorator để đánh dấu các route nào là public, tức là không cần phải có token để truy cập vào route đó. Khi mình sử dụng cái Public này thì nó sẽ set metadata với key là IS_PUBLIC_KEY và value là true, sau đó trong JwtAuthGuard mình sẽ check cái metadata này để quyết định xem có cần phải check token hay không. Nếu isPublic là true thì mình sẽ trả về true luôn, còn nếu không thì mình sẽ gọi super.canActivate(context) để tiếp tục check token như bình thường.

// export const RESPONSE_MESSAGE_KEY = 'response_message';
// export const ResponseMessage = (message: string) =>
//     SetMetadata(RESPONSE_MESSAGE_KEY, message);

// export const User = createParamDecorator(
//     (data: unknown, ctx: ExecutionContext) => {
//         const request = ctx.switchToHttp().getRequest();
//         return request.user;
//     },
// );
