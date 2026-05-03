
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}//'local' này là tên của strategy mà mình đã định nghĩa trong local.strategy.ts, nếu mình định nghĩa strategy khác thì mình sẽ phải thay đổi cái 'local' này thành tên của strategy đó
