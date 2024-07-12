import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagingResponse } from '../types/pagingResponse.type';

@Injectable()
export class HandleResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof PagingResponse) {
          const paging = {
            page: data.page,
            total_item: data.count,
            limit: data.limit,
          };
          return {
            code: 1,
            status: HttpStatus.OK,
            message: 'Thành công!',
            data: data.data,
            paging: paging,
          };
        } else {
          return {
            code: 1,
            status: HttpStatus.OK,
            message: 'Thành công!',
            data: data,
          };
        }
      }),
    );
  }
}
